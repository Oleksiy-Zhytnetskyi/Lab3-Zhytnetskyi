/* Classes */
class PageContentBuilder {
    /* Constructors */
    constructor() {
        updateListItemDeletionListeners();
    }

    /* "Public" Methods */
    addListItem(itemName, itemValue = 1) {
        const mainPanel = document.querySelector(".main-panel");
        
        const itemWrapper = document.createElement("section");
        itemWrapper.className = "main-panel-item";
        itemWrapper.appendChild(this.createListItemLabel(itemName));
        itemWrapper.appendChild(this.createListItemQuantityCounter(itemValue));
        itemWrapper.appendChild(this.createListItemPurchaseButtons());

        mainPanel.appendChild(itemWrapper);
        updateListItemDeletionListeners();
        return;
    }

    /* "Private" Methods */
    createListItemPurchaseButtons() {
        const buttonsWrapper = document.createElement("section");
        buttonsWrapper.className = "item-buttons";

        buttonsWrapper.appendChild(this.createRevertButton());
        buttonsWrapper.appendChild(this.createBoughtButton());
        buttonsWrapper.appendChild(this.createDeleteButton());

        return buttonsWrapper;
    }

    createDeleteButton() {
        const deleteButton = document.createElement("button");
        deleteButton.className = "item-button red-button square-button";
        deleteButton.innerHTML = "×";
        deleteButton.setAttribute("data-tooltip", "Remove");
        return deleteButton;
    }

    createBoughtButton() {
        const boughtButton = document.createElement("button");
        boughtButton.className = "item-button text-button square-button";
        boughtButton.innerHTML = "Куплено";
        boughtButton.setAttribute("data-tooltip", "Buy state");
        return boughtButton;
    }

    createRevertButton() {
        const revertButton = document.createElement("button");
        revertButton.className = "item-button text-button square-button disabled";
        revertButton.innerHTML = "Не куплено";
        revertButton.setAttribute("data-tooltip", "Buy state");
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

/* Event Listeners */

// Search Bar Input Field
document.querySelector(".main-panel-search-bar > input").addEventListener("keypress", listItemCreationHandler);

// Search Bar "Add Element" Button
document.querySelector(".main-panel-search-bar > button").addEventListener("click", addMainPanelListItem);

/* Event Handlers */
function listItemCreationHandler(event) {
    if (event.key === "Enter") addMainPanelListItem();
    return;
}

/* Functions */
function addMainPanelListItem() {
    const inputField = document.querySelector(".main-panel-search-bar > input");
    if (inputField.value !== "") {
        CONTENT_BUILDER.addListItem(inputField.value);
        inputField.value = "";
    }
    return;
}

function updateListItemDeletionListeners() {
    const deleteButtons = document.querySelectorAll(".item-buttons > .red-button");
    for (const button of deleteButtons) {
        button.addEventListener("click", function() {
            button.parentElement.parentElement.remove();
        });
    }
    return;
}