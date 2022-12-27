import { UIEventHelper } from "/js/UI/UIEventHelper.js";

export class UIHelper {
    /**
     * @typedef UIHelper.GenericElement
     * @property {string}                                                          [tag]
     * @property {string}                                                          [id]
     * @property {Array<string>}                                                   [class]
     * @property {Array<{property: string, value: string}>}                        [style]
     * @property {Array<HTMLElement>|string|HTMLElement}                           [content]
     * @property {Array<{property: string, value: string}>}                        [attributes]
     * @property {Array<{event: string, handlers: Array<function(Event):void>}>}    [events]
     */

    /**
     * Generates a simple element with the specified properties
     * @param {UIHelper.GenericElement} [config]
     * @param {HTMLElement}             [object]
     * @return {HTMLElement|null}
     * @constructor
     */
    static CreateOrUpdateElement(config, object = null) {
        if(config) {
            const newObject = object ?? document.createElement(config?.tag ?? "div");

            if(config?.id && typeof config?.id === "string")
                newObject.setAttribute("id", config.id);
            if(config?.class && Array.isArray(config.class))
                config.class.filter(classes => typeof classes === "string").forEach(classes => newObject.classList.add(classes));
            if(config?.style)
                config.style
                    .filter((keyValue) => keyValue)
                    .filter((keyValue) => keyValue.hasOwnProperty("property") && keyValue.hasOwnProperty("value"))
                    .filter((keyValue) => typeof keyValue.property === "string")
                    .forEach((keyValue) => {
                        newObject.style.setProperty(keyValue.property, keyValue.value);
                    });
            if(config?.content){
                if(Array.isArray(config.content))
                    config.content
                        .filter((elements) => elements)
                        .forEach((elements) => {
                            if(elements instanceof HTMLElement)
                                newObject.appendChild(elements);
                        });
                else if(typeof config.content === "string")
                    newObject.innerHTML = newObject.innerHTML.concat(config.content);
                else newObject.appendChild(config?.content);
            }
            if(config?.attributes && Array.isArray(config.attributes))
                config.attributes
                    .filter((keyValue) => keyValue)
                    .filter((keyValue) => keyValue.hasOwnProperty("property") && keyValue.hasOwnProperty("value"))
                    .filter((keyValue) => typeof keyValue.property === "string")
                    .forEach((keyValue) => {
                        newObject.setAttribute(keyValue.property, keyValue.value);
                    });
            if(config?.events && Array.isArray(config.events))
                config.events
                    .filter((keyValue) => keyValue)
                    .filter((keyValue) => keyValue.hasOwnProperty("event") && keyValue.hasOwnProperty("handlers"))
                    .filter((keyValue) => typeof keyValue.event === "string" && Array.isArray(keyValue.handlers))
                    .filter((keyValue) => keyValue.handlers.every((handler) => handler instanceof Function))
                    .forEach((keyValue ) => {
                        keyValue.handlers.forEach((handler) => newObject.addEventListener(keyValue.event, handler));
                    });
            return newObject;
        }
        return object;
    }

    /**
     *
     * @param {UIHelper.GenericElement} config
     * @return {boolean}
     * @constructor
     */
    static HasID(config){ return config?.id || config?.input?.attributes.some((attributes) => attributes.property == "id"); }

    /**
     *
     * @param {UIHelper.GenericElement} config
     * @return {string|null}
     * @constructor
     */
    static ObtainID(config) {
        return UIHelper.HasID(config)
            ?(config?.id ?? config?.input?.attributes.filter((attributes) => attributes.property == "id")[0].value)
            : null;
    }

    /**
     *
     * @param {object}                  [config]
     * @param {UIHelper.GenericElement} [config.parent]
     * @param {UIHelper.GenericElement} [config.label]
     * @param {UIHelper.GenericElement} [config.container]
     * @param {UIHelper.GenericElement} [config.input]
     * @param {UIHelper.GenericElement} [config.button]
     * @return {HTMLElement|null}
     * @constructor
     */
    static PrepareFileInputElement(config) {
        const fileInputParent = UIHelper.CreateOrUpdateElement({
            tag : "div",
        });

        const fileInputLabel = UIHelper.CreateOrUpdateElement({
            tag: "label",
            class: ["form-label"],
            attributes: [
                { property: "for", value: UIHelper.ObtainID(config?.input) }
            ]
        });
        const fileInputContainer = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["input-group", "mb-3"],
        });

        const fileInputElement = UIHelper.CreateOrUpdateElement({
            tag: "input",
            class: ["form-control"],
            attributes: [{property: "type", value: "file"}, {property: "accept", value: "image/png"}],
        });
        const fileInputBtn = UIHelper.CreateOrUpdateElement({
            tag: "button",
            attributes: [{property: "type", value: "button"}, {property: "disabled", value: null}],
            class: ["btn", "btn-danger"],
        });

        fileInputElement.addEventListener("change", (event) => {
            fileInputBtn.classList.remove("btn-danger");
            fileInputBtn.classList.add("btn-success");
            fileInputBtn.removeAttribute("disabled");
        });

        fileInputParent.appendChild(UIHelper.CreateOrUpdateElement(config?.label, fileInputLabel));
        fileInputContainer.appendChild(UIHelper.CreateOrUpdateElement(config?.input, fileInputElement));
        fileInputContainer.appendChild(UIHelper.CreateOrUpdateElement(config?.button, fileInputBtn));

        fileInputParent.appendChild(UIHelper.CreateOrUpdateElement(config?.container, fileInputContainer));

        return UIHelper.CreateOrUpdateElement(config?.parent, fileInputParent);
    }

    /**
     * @param {object}                          [config]
     * @param {UIHelper.GenericElement}         [config.parent]
     * @param {UIHelper.GenericElement}         [config.header]
     * @param {UIHelper.GenericElement}         [config.container]
     * @param {Array<{element: UIHelper.GenericElement, label: UIHelper.GenericElement, item: UIHelper.GenericElement}>}  [config.options]
     * @return {HTMLElement|null}
     * @constructor
     */
    static PrepareOptionPanelElement(config ) {
        const optionPanelParent = UIHelper.CreateOrUpdateElement({
            tag : "div",
        });

        const optionPanelHeader = UIHelper.CreateOrUpdateElement({
            tag : "p",
        });

        const optionPanelContainer = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["btn-group", "w-100", "p-1"],
            attributes: [{property: "role", value: "group"}]
        });

        if(config?.options && Array.isArray(config?.options)) {
            config.options.forEach((options) => {
                const optionPanelOptionElement = UIHelper.CreateOrUpdateElement({
                    tag: "input",
                    attributes: [
                        {property: "type", value: "radio"},
                        {property: "autocomplete", value: "off"},
                    ],
                    class: ["me-1", "btn-check"]
                });

                const optionPanelOptionLabel = UIHelper.CreateOrUpdateElement({
                    tag: "label",
                    class: ["btn", "w-100"],
                    attributes: [
                        { property: "for", value: UIHelper.ObtainID(options?.item) }
                    ]
                });

                optionPanelContainer.appendChild(UIHelper.CreateOrUpdateElement(options?.item, optionPanelOptionElement));
                optionPanelContainer.appendChild(UIHelper.CreateOrUpdateElement(options?.label, optionPanelOptionLabel));
            });

            if(config.options.length > 0)
                UIHelper.CreateOrUpdateElement({attributes: [{property: "checked", value: ""}]}, optionPanelContainer.getElementsByTagName("input")[0]);
        }

        if(config?.header) optionPanelParent.appendChild(UIHelper.CreateOrUpdateElement(config?.header, optionPanelHeader));
        optionPanelParent.appendChild(UIHelper.CreateOrUpdateElement(config?.container, optionPanelContainer));

        return UIHelper.CreateOrUpdateElement(config?.parent, optionPanelParent);
    }

    /**
     * @param {object}                          [config]
     * @param {UIHelper.GenericElement}         [config.parent]
     * @param {UIHelper.GenericElement}         [config.header]
     * @param {UIHelper.GenericElement}         [config.container]
     * @param {UIHelper.GenericElement}         [config.element]
     * @param {UIHelper.GenericElement|HTMLElement}         [config.button]
     * @return {HTMLElement|null}
     * @constructor
     */
    static PrepareImagePreviewElement(config ) {
        const imagePreviewParent = UIHelper.CreateOrUpdateElement({
            tag : "div",
        });

        const imagePreviewHeader = UIHelper.CreateOrUpdateElement({
            tag : "span",
        });

        const imagePreviewContainer = UIHelper.CreateOrUpdateElement({
            tag : "div",
        });

        const imagePreviewElement = UIHelper.CreateOrUpdateElement({
            tag : "img",
            class: ["img-thumbnail"]
        });

        const imagePreviewButton =UIHelper.CreateOrUpdateElement({
            tag : "button",
            class: ["btn", "w-100"]
        });

        imagePreviewContainer.appendChild(UIHelper.CreateOrUpdateElement(config?.element, imagePreviewElement));
        imagePreviewContainer.appendChild(UIHelper.CreateOrUpdateElement(config?.button, imagePreviewButton));

        imagePreviewParent.appendChild(UIHelper.CreateOrUpdateElement(config?.header, imagePreviewHeader));
        imagePreviewParent.appendChild(UIHelper.CreateOrUpdateElement(config?.container, imagePreviewContainer));

        return UIHelper.CreateOrUpdateElement(config?.parent, imagePreviewParent);
    }

    /**
     * @param {object}                                      [config]
     * @param {UIHelper.GenericElement}                     [config.container]
     * @param {UIHelper.GenericElement}                     [config.header]
     * @param {Array<UIHelper.GenericElement|HTMLElement>}  [config.items]
     * @return {HTMLElement|null}
     * @constructor
     */
    static PrepareMenuItemSectionListElement(config) {
        const menuItemSectionListContainer = UIHelper.CreateOrUpdateElement({
            tag : "ul",
            class: ["list-group", "list-group-flush"]
        });

        const menuItemSectionListHeader = UIHelper.CreateOrUpdateElement({
            tag : "div",
        });

        menuItemSectionListContainer.appendChild(UIHelper.CreateOrUpdateElement(config?.header, menuItemSectionListHeader));
        if(config?.items && Array.isArray(config?.items)) {
            config.items.forEach((panel) => {
                const menuItemSectionListItem = UIHelper.CreateOrUpdateElement({
                    tag: "li",
                    class: ["list-group-item"]
                });

                if (!(panel instanceof HTMLElement)) {
                    menuItemSectionListItem.appendChild(UIHelper.CreateOrUpdateElement(panel));
                } else menuItemSectionListItem.appendChild(panel);

                menuItemSectionListContainer.appendChild(menuItemSectionListItem);
            });
        }

        return UIHelper.CreateOrUpdateElement(config?.container, menuItemSectionListContainer);
    }

    /**
     * @param {object}                                      [config]
     * @param {UIHelper.GenericElement}                     [config.parent]
     * @param {UIHelper.GenericElement}                     [config.header]
     * @param {UIHelper.GenericElement}                     [config.body]
     * @param {UIHelper.GenericElement}                     [config.title]
     * @param {UIHelper.GenericElement}                     [config.subtitle]
     * @param {UIHelper.GenericElement}                     [config.container]
     * @param {Array<UIHelper.GenericElement|HTMLElement>}  [config.panels]
     * @return {HTMLElement|null}
     * @constructor
     */
    static PrepareMenuItemSectionElement(config) {
        const menuItemSectionParent = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["card", "my-3"]
        });

        const menuItemSectionBody = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["card-body"]
        });

        const menuItemSectionHeader = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["card-header"]
        });

        const menuItemSectionTitle = UIHelper.CreateOrUpdateElement({
            tag : "p",
            class: ["card-title"]
        });

        const menuItemSectionSubtitle = UIHelper.CreateOrUpdateElement({
            tag : "p",
            class: ["card-subtitle", "mb-2", "text-muted"]
        });

        const menuItemSectionContainer = UIHelper.CreateOrUpdateElement({
            tag : "ul",
            class: ["list-group", "list-group-flush"]
        });

        if(config?.panels && Array.isArray(config?.panels)) {
            config.panels.forEach((panel) => {
                const menuItemSection = UIHelper.CreateOrUpdateElement({
                    tag: "li",
                    class: ["list-group-item"]
                });

                if (!(panel instanceof HTMLElement)) {
                    menuItemSection.appendChild(UIHelper.CreateOrUpdateElement(panel));
                } else menuItemSection.appendChild(panel);

                menuItemSectionContainer.appendChild(menuItemSection);
            });
        }

        menuItemSectionParent.appendChild(UIHelper.CreateOrUpdateElement(config?.header, menuItemSectionHeader));
        if(config?.title) menuItemSectionBody.appendChild(UIHelper.CreateOrUpdateElement(config?.title, menuItemSectionTitle));
        if(config?.subtitle) menuItemSectionBody.appendChild(UIHelper.CreateOrUpdateElement(config?.subtitle, menuItemSectionSubtitle));
        if(config?.body) menuItemSectionParent.appendChild(UIHelper.CreateOrUpdateElement(config?.container, menuItemSectionBody));
        menuItemSectionParent.appendChild(UIHelper.CreateOrUpdateElement(config?.container, menuItemSectionContainer));
        return UIHelper.CreateOrUpdateElement(config?.parent, menuItemSectionParent);
    }

    /**
     * @param {object}                          [config]
     * @param {UIHelper.GenericElement}         [config.parent]
     * @param {UIHelper.GenericElement}         [config.header]
     * @param {UIHelper.GenericElement}         [config.control]
     * @param {UIHelper.GenericElement}         [config.container]
     * @param {Array<UIHelper.GenericElement|HTMLElement>}         [config.sections]
     * @return {HTMLElement|null}
     * @constructor
     */
    static PrepareMenuItemElement(config) {
        const menuItemParent = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["accordion-item"],
            style: [
                { property: "flex-grow", value: "0" },
                { property: "overflow-y", value: "visible" },
            ]
        });

        const menuItemHeader = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["accordion-header"]
        });
        const menuItemHeaderControl = UIHelper.CreateOrUpdateElement({
            tag : "button",
            class: ["text-uppercase", "accordion-button", "collapsed"],
            attributes: [
                {property: "data-bs-toggle", value: "collapse"},
                {property: "aria-expanded", value: "false"},
                {property: "type", value: "button"},
                { property: "data-bs-target", value: "#"+UIHelper.ObtainID(config?.container) },
                { property: "aria-controls", value: UIHelper.ObtainID(config?.container) }
            ]
        });

        const menuItemContainer = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["accordion-body", "accordion-collapse", "collapse"]
        });

        if(config?.sections && Array.isArray(config?.sections)) {
            config.sections.forEach((section) => {
                if (!section instanceof HTMLElement){
                    menuItemContainer.appendChild(UIHelper.CreateOrUpdateElement(section));
                } else menuItemContainer.appendChild(section);
            });
        }

        menuItemHeader.appendChild(UIHelper.CreateOrUpdateElement(config?.control, menuItemHeaderControl));
        menuItemParent.appendChild(UIHelper.CreateOrUpdateElement(config?.header, menuItemHeader));
        menuItemParent.appendChild(UIHelper.CreateOrUpdateElement(config?.container, menuItemContainer));
        return UIHelper.CreateOrUpdateElement(config?.parent, menuItemParent);
    }

    /**
     * @param {object}                          [config]
     * @param {UIHelper.GenericElement}         [config.parent]
     * @param {Array<UIHelper.GenericElement|HTMLElement>}         [config.items]
     * @return {HTMLElement|null}
     * @constructor
     */
    static PrepareMenuElement(config) {
        const menuParent = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["accordion"],
            style: [
                {property: "height", value: "100vh"},
                {property: "display", value: "flex"},
                {property: "flex-flow", value: "column nowrap"},
            ]
        });

        if(config?.items && Array.isArray(config?.items)) {
            config.items.forEach((item) => {
                const handlerClick = {
                    event: "click",
                    handlers: [ UIEventHelper.MenuItemHandlerClick ]
                };
                if (!item instanceof HTMLElement){
                    item.events ??= [];
                    item?.events.push(handlerClick);
                    menuParent.appendChild(UIHelper.CreateOrUpdateElement(item));
                } else {
                    menuParent.appendChild(UIHelper.CreateOrUpdateElement({
                            events: [ handlerClick ]
                        },
                        item
                    ));
                }
            });
            menuParent.firstElementChild.style.flexGrow = "1";
            menuParent.firstElementChild.style.overflowY = "overlay";
            menuParent.firstElementChild.getElementsByClassName("accordion-button")[0].classList.remove("collapsed");
            menuParent.firstElementChild.getElementsByClassName("accordion-button")[0].setAttribute("aria-expanded", "true");
            menuParent.firstElementChild.getElementsByClassName("collapse")[0].classList.add("show");
        }

        return UIHelper.CreateOrUpdateElement(config?.parent, menuParent);
    }

    /**
     * @param {object}                          [config]
     * @param {UIHelper.GenericElement}         [config.parent]
     * @param {UIHelper.GenericElement}         [config.container]
     * @param {HTMLElement}                     [config.menu]
     * @param {UIHelper.GenericElement}         [config.control]
     * @return {HTMLElement|null}
     * @constructor
     */
    static PrepareUIElement(config) {
        const uiParent = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["d-flex"],
            style: [
                {property: "min-height", value: "100vh"}
            ]
        });

        const uiContainer = UIHelper.CreateOrUpdateElement({
            tag : "div",
            class: ["w-100", "collapse", "collapse-horizontal", "show"]
        });

        const uiControl = UIHelper.CreateOrUpdateElement({
            tag : "button",
            class: ["btn", "m-1"],
            attributes: [
                { property: "data-bs-toggle", value: "collapse"},
                { property: "aria-expanded", value: "true"},
                { property: "type", value: "button"},
                { property: "data-bs-target", value: "#"+UIHelper.ObtainID(config?.container) },
                { property: "aria-controls", value: UIHelper.ObtainID(config?.container) }
            ]
        });

        uiContainer.appendChild(config?.menu);

        uiParent.appendChild(UIHelper.CreateOrUpdateElement(config?.container, uiContainer));
        uiParent.appendChild(UIHelper.CreateOrUpdateElement(config?.control, uiControl));
        return UIHelper.CreateOrUpdateElement(config?.parent, uiParent);
    }
}