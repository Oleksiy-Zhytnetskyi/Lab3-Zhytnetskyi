/* Classes */
class PageContentBuilder {
    /* Constructors */
    constructor() { initEventListeners(); }

    /* "Public" Methods */
    addListItem(itemName, itemValue = 1) {
        const mainPanel = document.querySelector(".main-panel");
        
        const itemWrapper = document.createElement("section");
        itemWrapper.className = "main-panel-item";
        itemWrapper.appendChild(this.createListItemLabel(itemName));
        itemWrapper.appendChild(this.createListItemQuantityCounter(itemValue));
        itemWrapper.appendChild(this.createListItemPurchaseButtons());
        
        mainPanel.appendChild(itemWrapper);
        return;
    }

    /* "Private" Methods */
    createListItemPurchaseButtons() {
        const buttonsWrapper = document.createElement("section");
        buttonsWrapper.className = "item-buttons";

        buttonsWrapper.appendChild(this.createRevertButton());
        buttonsWrapper.appendChild(this.createBuyButton());
        buttonsWrapper.appendChild(this.createDeleteButton());

        return buttonsWrapper;
    }

    createDeleteButton() {
        const deleteButton = document.createElement("button");
        deleteButton.className = "item-button red-button square-button";
        deleteButton.innerHTML = "×";
        deleteButton.setAttribute("data-tooltip", "Remove");
        deleteButton.addEventListener("click", () => { 
            deleteButton.parentElement.parentElement.remove(); 
        });
        return deleteButton;
    }

    createBuyButton() {
        const buyButton = document.createElement("button");
        buyButton.className = "item-button text-button square-button buy-button";
        buyButton.innerHTML = "Куплено";
        buyButton.setAttribute("data-tooltip", "Buy state");
        buyButton.addEventListener("click", () => {
            changeButtonsVisibility(buyButton, true);
        });
        return buyButton;
    }

    createRevertButton() {
        const revertButton = document.createElement("button");
        revertButton.className = "item-button text-button square-button revert-button disabled";
        revertButton.innerHTML = "Не куплено";
        revertButton.setAttribute("data-tooltip", "Buy state");
        revertButton.addEventListener("click", () => {
            changeButtonsVisibility(revertButton, false);
        });
        return revertButton;
    }

    createListItemQuantityCounter(itemValue) {
        const itemQuantityWrapper = document.createElement("section");
        itemQuantityWrapper.className = "item-counter";

        itemQuantityWrapper.appendChild(this.createDecrementButton(itemValue));
        itemQuantityWrapper.appendChild(this.createCounterDisplay(itemValue));
        itemQuantityWrapper.appendChild(this.createIncrementButton());

        return itemQuantityWrapper;
    }

    createIncrementButton() {
        const incrementButton = document.createElement("button");
        incrementButton.className = "item-button green-button circle-button";
        incrementButton.innerHTML = "+";
        incrementButton.setAttribute("data-tooltip", "Increment");
        incrementButton.addEventListener("click", () => {
            modifyItemCount(incrementButton, true);
        });
        return incrementButton;
    }

    createCounterDisplay(itemValue) {
        const displayWrapper = document.createElement("span");
        displayWrapper.className = "item-wrapper";
        
        const counterDisplay = document.createElement("span");
        counterDisplay.className = "item-counter-number";
        counterDisplay.innerHTML = itemValue;

        displayWrapper.appendChild(counterDisplay);
        return displayWrapper;
    }

    createDecrementButton(itemValue) {
        const decrementButton = document.createElement("button");
        decrementButton.className = "item-button red-button circle-button";
        if (itemValue === 1) {
            decrementButton.className += " inactive";
            decrementButton.tabIndex = -1;
        }
        decrementButton.innerHTML = "–";
        decrementButton.setAttribute("data-tooltip", "Decrement");
        decrementButton.addEventListener("click", () => {
            modifyItemCount(decrementButton, false);
        });
        return decrementButton;
    }

    createListItemLabel(itemName) {
        const itemLabel = document.createElement("section");
        itemLabel.className = "item-label";
        itemLabel.innerHTML = itemName;
        return itemLabel;
    }
}

/* Object Instantiation */
const CONTENT_BUILDER = new PageContentBuilder();

/* Functions */
function addMainPanelListItem() {
    const inputField = document.querySelector(".main-panel-search-bar > input");
    if (inputField.value !== "") {
        CONTENT_BUILDER.addListItem(inputField.value);
        inputField.value = "";
    }
    return;
}

function changeButtonsVisibility(eventSourceButton, isBuying) {
    const itemButtons = eventSourceButton.parentElement.parentElement.querySelectorAll(".item-button");
    for (const button of itemButtons) {
        if (button.className.includes("revert-button")) {
            (isBuying) ? button.style.display = "inline-block" : button.style.display = "none";
        }
        else (isBuying) ? button.style.display = "none" : button.style.display = "inline-block";
    }
    return;
}

function modifyItemCount(eventSourceButton, isIncrementing) {
    const itemCountLabel = eventSourceButton.parentElement.parentElement.querySelector(".item-counter-number");
    if ((itemCountLabel.innerHTML === "1" && !isIncrementing) === false) {
        (isIncrementing) ? ++itemCountLabel.innerHTML : --itemCountLabel.innerHTML;
        updateDecrementButtonDisplayState(
            eventSourceButton.parentElement.parentElement.querySelector(".item-counter > .red-button"), 
            itemCountLabel.innerHTML
        );
    }
    return;
}

function updateDecrementButtonDisplayState(button, itemHtmlValue) {
    if (itemHtmlValue === "1" && !button.className.includes("inactive")) button.className += " inactive";
    else button.className = button.className.replace(" inactive", "");
    return;
}

/* Event Listeners & Handlers */
function initEventListeners() {
    initListItemCreationListener();
    initListItemCreationButtonListener();

    initListItemDeletionListeners();
    initListItemPurchaseListeners(true);
    initListItemPurchaseListeners(false);

    initListItemCountModifierListeners(true);
    initListItemCountModifierListeners(false);
    return;
}

function initListItemCountModifierListeners(isIncrementing) {
    const buttons = (isIncrementing) ? document.querySelectorAll(".item-counter > .green-button") : 
        document.querySelectorAll(".item-counter > .red-button");
    for (const button of buttons) {
        button.addEventListener("click", () => {
            modifyItemCount(button, isIncrementing);
        });
    }
    return;
}

function initListItemPurchaseListeners(isBuying) {
    const buttons = (isBuying) ? document.querySelectorAll(".buy-button") : document.querySelectorAll(".revert-button");
    for (const button of buttons) {
        button.addEventListener("click", () => {
            changeButtonsVisibility(button, isBuying);
        });
    }
    return;
}

function initListItemDeletionListeners() {
    const deleteButtons = document.querySelectorAll(".item-buttons > .red-button");
    for (const button of deleteButtons) {
        button.addEventListener("click", () => { 
            button.parentElement.parentElement.remove(); 
        });
    }
    return;
}

function initListItemCreationButtonListener() {
    document.querySelector(".main-panel-search-bar > button").addEventListener("click", addMainPanelListItem);
    return;
}

function initListItemCreationListener() {
    document.querySelector(".main-panel-search-bar > input").addEventListener("keypress", (event) => {
        if (event.key === "Enter") addMainPanelListItem();
    });
    return;
}