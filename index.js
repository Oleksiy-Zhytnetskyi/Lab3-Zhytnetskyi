/* Classes */
class PageContentBuilder {
    /* Constructors */
    constructor() { 
        initListItemCreationListener();
        initListItemCreationButtonListener();
    }

    /* "Public" Methods */
    addSidePanelItem(itemName, isBought, itemValue = 1) {
        const sidePanelRemaining = (isBought) ? document.querySelector(".side-panel-bought-items") :
            document.querySelector(".side-panel-remaining-items");

        const itemWrapper = document.createElement("section");
        itemWrapper.className = "item-card using-right-margin";
        itemWrapper.appendChild(this.createSidePanelItemName(itemName, isBought));
        itemWrapper.appendChild(this.createSidePanelItemCount(itemValue));

        sidePanelRemaining.appendChild(itemWrapper);
        return;
    }

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
    createSidePanelItemCount(itemValue) {
        const itemValueWrapper = document.createElement("span");
        itemValueWrapper.className = "item-amount";
        itemValueWrapper.innerHTML = itemValue;
        return itemValueWrapper;
    }

    createSidePanelItemName(itemName, isBought) {
        const itemNameWrapper = document.createElement("span");
        itemNameWrapper.className = "item-label";
        itemNameWrapper.innerHTML = itemName;
        (isBought) ? itemNameWrapper.style.textDecoration = "line-through" : itemNameWrapper.style.textDecoration = "none";
        return itemNameWrapper;
    }

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
            const itemName = deleteButton.parentElement.parentElement.querySelector(".item-label").innerHTML;
            deleteButton.parentElement.parentElement.remove();
            this.deleteSidePanelItem(itemName, false);
            EXISTING_ITEM_NAMES = EXISTING_ITEM_NAMES.filter(elementName => elementName !== itemName.toLowerCase());
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

            const itemLabel = buyButton.parentElement.parentElement.querySelector(".item-label");
            const itemValue = buyButton.parentElement.parentElement.querySelector(".item-counter-number").innerHTML;
            this.deleteSidePanelItem(itemLabel.innerHTML, false);
            this.addSidePanelItem(itemLabel.innerHTML, true, itemValue)
        
            itemLabel.style.textDecoration = "line-through";
            itemLabel.contentEditable = "false";
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

            const itemLabel = revertButton.parentElement.parentElement.querySelector(".item-label");
            const itemValue = revertButton.parentElement.parentElement.querySelector(".item-counter-number").innerHTML;
            this.deleteSidePanelItem(itemLabel.innerHTML, true);
            this.addSidePanelItem(itemLabel.innerHTML, false, itemValue);
            
            itemLabel.style.textDecoration = "none";
            itemLabel.contentEditable = "true";
        });
        return revertButton;
    }

    deleteSidePanelItem(itemName, isBought) {
        const items = (isBought) ? document.querySelectorAll(".side-panel-bought-items > .item-card") : 
            document.querySelectorAll(".side-panel-remaining-items > .item-card");
        for (const item of items) {
            if (item.children[0].innerHTML === itemName) {
                item.remove();
                break;
            }
        }
        return;
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
            modifyItemCount(
                incrementButton, true,
                incrementButton.parentElement.parentElement.querySelector(".item-label").innerHTML
            );
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
            modifyItemCount(
                decrementButton, false,
                decrementButton.parentElement.parentElement.querySelector(".item-label").innerHTML 
            );
        });
        return decrementButton;
    }

    createListItemLabel(itemName) {
        const itemLabel = document.createElement("section");
        itemLabel.className = "item-label";
        itemLabel.innerHTML = itemName;
        itemLabel.contentEditable = "true";
        itemLabel.setAttribute("data-previous-content", itemName);
        itemLabel.addEventListener("input", () => {
            EXISTING_ITEM_NAMES = EXISTING_ITEM_NAMES.filter(
                elementName => elementName !== itemLabel.getAttribute("data-previous-content").toLowerCase()
            );
            EXISTING_ITEM_NAMES.push(itemLabel.innerHTML.toLowerCase());
            
            renameSidePanelItem(itemLabel.getAttribute("data-previous-content"), itemLabel.innerHTML);
            if (nameOccurrenceCount(itemLabel.innerHTML) > 1) {
                this.deleteSidePanelItem(itemLabel.innerHTML, false);
                itemLabel.parentElement.remove();
            }
            
            itemLabel.setAttribute("data-previous-content", itemLabel.innerHTML);
        });
        return itemLabel;
    }
}

/* Object Instantiation */
let EXISTING_ITEM_NAMES = [ "помідори", "печиво", "сир" ];
const CONTENT_BUILDER = new PageContentBuilder();

createInitialListItems();

/* Functions */
function createInitialListItems() {
    createInitialListItem("Помідори");
    createInitialListItem("Печиво");
    createInitialListItem("Сир");
    return;
}

function createInitialListItem(itemName, itemValue = 1) {
    CONTENT_BUILDER.addListItem(itemName, itemValue);
    CONTENT_BUILDER.addSidePanelItem(itemName, false, itemValue);
    return;
}

function addMainPanelListItem() {
    const inputField = document.querySelector(".main-panel-search-bar > input");
    if (inputField.value !== "" && !EXISTING_ITEM_NAMES.includes(inputField.value.toLowerCase())) {
        CONTENT_BUILDER.addListItem(inputField.value);
        CONTENT_BUILDER.addSidePanelItem(inputField.value, false);
        EXISTING_ITEM_NAMES.push(inputField.value.toLowerCase());
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

function modifyItemCount(eventSourceButton, isIncrementing, itemName) {
    const itemCountLabel = eventSourceButton.parentElement.parentElement.querySelector(".item-counter-number");
    if ((itemCountLabel.innerHTML === "1" && !isIncrementing) === false) {
        (isIncrementing) ? ++itemCountLabel.innerHTML : --itemCountLabel.innerHTML;
        updateSidePanelItems(isIncrementing, itemName);
        updateDecrementButtonDisplayState(
            eventSourceButton.parentElement.parentElement.querySelector(".item-counter > .red-button"), 
            itemCountLabel.innerHTML
        );
    }    
    return;
}

function updateSidePanelItems(isIncrementing, itemName) {
    const sidePanelRemainingItems = document.querySelectorAll(".side-panel-remaining-items > .item-card");
    for (const item of sidePanelRemainingItems) {
        if (item.children[0].innerHTML === itemName) {
            (isIncrementing) ? ++item.children[1].innerHTML : --item.children[1].innerHTML;
        }
    }
    return;
}

function updateDecrementButtonDisplayState(button, itemHtmlValue) {
    if (itemHtmlValue === "1" && !button.className.includes("inactive")) button.className += " inactive";
    else button.className = button.className.replace(" inactive", "");
    return;
}

function renameSidePanelItem(targetName, newName) {
    const items = document.querySelectorAll(".side-panel-remaining-items > .item-card");
    for (const item of items) {
        if (item.children[0].innerHTML === targetName) {
            item.children[0].innerHTML = newName;
            break;
        }
    }
    return;
}

function nameOccurrenceCount(newName) {
    let counter = 0;
    for (const itemName of EXISTING_ITEM_NAMES) {
        if (itemName === newName.toLowerCase()) ++counter;
    }
    return counter;
}

/* Event Listeners & Handlers */
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