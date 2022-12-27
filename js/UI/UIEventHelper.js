export class UIEventHelper {
    /**
     * Handles the default actions to execute when a menu items is clicked.
     * @param {MouseEvent} event
     * @constructor
     */
    static MenuItemHandlerClick(event) {
        const had = event.target.parentElement.parentElement.style.flexGrow;
        event.target.parentElement.parentElement.parentElement.childNodes.forEach((child) => {
            child.style.flexGrow = "0";
            child.style.overflowY = "visible";
        }, document);

        event.target.parentElement.parentElement.style.flexGrow = had == "1" ? "0" : "1";
        event.target.parentElement.parentElement.style.overflowY = "overlay";
    }
}