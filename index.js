const items = document.querySelectorAll(".item-amount");
for (const item of items) {
    item.style.userSelect = "none";
    item.style.backgroundColor = "limegreen";
}