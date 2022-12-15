import { CanvasEventHelper } from '/js/app/CanvasEventHelper.js';
import { ViewerHelper } from '/js/app/ViewerHelper.js';
import { CanvasPatternHelper } from "/js/app/CanvasPatternHelper.js";

export class App {
    canvasHelper;
    viewerHelper;

    canvasContainer = null;
    shouldAddCanvasStyle = true;
    canvasStyle = null;
    canvasStyleBootstrap = null;

    uiConfig;
    ui;
    content;
    contentConfig;

    constructor(props) {
        this.uiConfig = {
            menu: {
                items: [{
                    header: "Controls",
                    id: "control",
                    content: this.PrepareControls(),
                    onclick: this.UIMenuItemClickHandler,
                    style: null,
                    class: ["fs-5", "text-uppercase"]
                }, {
                    header: "Credits",
                    id: "credit",
                    content: this.PrepareCredits(),
                    onclick: this.UIMenuItemClickHandler,
                    style: null,
                    class: ["fs-5", "text-uppercase"]
                }],
                class: ["w-100"],
                style: [
                    { height: "100%"                },
                    { display: "flex"               },
                    { "flex-flow": "column nowrap"  }
                ]
            },
            control: {
                content: ["+"],
                style: null,
                class: ["rounded-0"],
                onclick: this.UIControlClickHandler
            },
            class: ["col-4"],
            style: [{"height": "100vh"}]
        };
        this.contentConfig = {
            threejs: {
                class: ["d-none", "h-100"],
                style: []
            },
            canvas: {
                class: ["position-relative", "border", "border-dark", "d-none"],
                style: [{"height": "100vh"},]
            },
            class: ["col-8"],
            style: null
        }

        this.ui = {
            element: null,
            menu:  {
                element: null,
                control: null,
                header: null,
                items: []
            },
            control: {
                element: null
            }
        }
        this.content = {
            element: null,
            viewer: {
                element: null
            },
            canvas: {
                container: null,
                layers: []
            }
        };
    }

    GetUI() { return this.ui.element; }
    GetMenu() { return this.ui.menu.element; }
    GetMenuControl() { return this.ui.menu.control; }
    GetMenuHeader() { return this.ui.menu.header; }
    GetMenuItems() { return this.ui.menu.items; }

    PrepareButtonControl(config = {id: null, section: null, text: null, class: null, style: null, click: null}) {
        const buttonControl = document.createElement("button");
        buttonControl.setAttribute("id", `controls-${config.section}-${config.id}--btn`);
        buttonControl.addEventListener('click', config.click);
        buttonControl.classList.add("btn");
        if(config && config.class) config.class.forEach((styleClass) => buttonControl.classList.add(styleClass));
        if(config && config.style)
            config.style.map((style) => Object.entries(style)).forEach(([[key, value]]) => buttonControl.style.setProperty(key, value));
        buttonControl.textContent = config.text;
        return buttonControl;
    }
    PrepareOptionControl(config = {id: null, section: null, text: null, click: null, disabled: null}) {
        const optionRadio = document.createElement("input");
        optionRadio.classList.add("me-1", "btn-check");
        optionRadio.setAttribute("type", "radio");
        optionRadio.setAttribute("autocomplete", "off");
        optionRadio.setAttribute("name", `controls-${config.section}-group`);
        optionRadio.setAttribute("id", `controls-${config.section}-${config.id}-radio`);
        optionRadio.setAttribute(`data-drawing-${config.section}`, config.id);
        optionRadio.setAttribute(`data-drawing-disabled-pattern`, config.disabled);
        optionRadio.addEventListener('change', config.click);


        const optionSpan = document.createElement("label");
        optionSpan.classList.add("btn", "btn-outline-primary", "w-100");
        optionSpan.setAttribute("for", `controls-${config.section}-${config.id}-radio`);
        optionSpan.innerHTML = config.text;

        const optionItem = document.createElement("li");
        optionItem.classList.add("list-group-item", "w-100");
        optionItem.appendChild(optionRadio);
        optionItem.appendChild(optionSpan);
        return optionItem;
    }
    PrepareDrawingOptionControl(config= {options: [{id: null, text: null, click: null, options: [{id: null, text: null, disabled: null}]}]}) {
        const options = [];
        config.options.forEach((option) => {
            const optionGroupContainer = document.createElement("div");
            optionGroupContainer.classList.add("btn-group-vertical", "w-100");
            optionGroupContainer.setAttribute("role", "group");

            const optionGroupHeader = document.createElement("h6");
            optionGroupHeader.innerHTML = option.text;
            optionGroupContainer.appendChild(optionGroupHeader);

            option.options.forEach((subOption) => {
                optionGroupContainer.appendChild(this.PrepareOptionControl({
                    id: subOption.id,
                    section: option.id,
                    text: subOption.text,
                    disabled: subOption.disabled,
                    click: option.click
                }));
            });
            optionGroupContainer.getElementsByTagName("input")[0].setAttribute("checked", null);
            options.push(optionGroupContainer);
        });
        return options;
    }
    PrepareFileInputControl(config = {section: null, text: null, id: null}) {
        const inputContainer = document.createElement("div");

        const inputLabel = document.createElement("label");
        inputLabel.textContent = config.text;
        inputLabel.setAttribute("for", `controls-${config.section}-${config.id}-inputField`);
        inputLabel.classList.add("form-label");
        inputContainer.appendChild(inputLabel);

        const inputCont = document.createElement("div");
        inputCont.classList.add("input-group", "mb-3");

        const inputElement = document.createElement("input");
        inputElement.setAttribute("id", `controls-${config.section}-${config.id}-inputField`);
        inputElement.setAttribute("type", "file");
        inputElement.setAttribute("accept", "image/png");
        inputElement.classList.add("form-control");
        inputElement.addEventListener('change', this.UIMenuItemFileInputChangeHandler.bind(this));
        inputCont.appendChild(inputElement);

        const inputBtn = document.createElement("button");
        inputBtn.setAttribute("id", `controls-${config.section}-${config.id}-btn`);
        inputBtn.setAttribute("type", "button");
        inputBtn.setAttribute("disabled", null);
        inputBtn.innerHTML = "Proccess";
        inputBtn.classList.add("btn", "btn-danger");
        inputBtn.addEventListener('click', this.UIMenuItemFileInputClickHandler.bind(this));
        inputCont.appendChild(inputBtn);

        inputContainer.appendChild(inputCont);

        return inputContainer;
    }
    PrepareControls() {
        const toggleContentViewer = document.createElement("button");
        toggleContentViewer.setAttribute("id", `controls-viewer-toggle-btn`);
        toggleContentViewer.addEventListener('click', this.UIMenuItemToggleContentClickHandler.bind(this));
        toggleContentViewer.classList.add("btn", "btn-warning");
        toggleContentViewer.textContent = "Click to show";

        const viewer = {
            header: "3d Viewer",
            id: "viewer",
            body: [{
                elements: [
                    toggleContentViewer,
                    '<span>Left-mouse to rotate.</span>',
                    '<span>Scroll to move in-out.</span>',
                    '<span>Right-mouse to move.</span>'
                ]
            }],
            style: null,
            class: ["mb-3"]
        }

        const faceStudioBodyInputs = [];
        const faceStudioInputs = {
            header: "Face Studio Inputs",
            id: "face-studio-inputs",
            body: faceStudioBodyInputs,
            style: null,
            class: ["mb-3"]
        };

        const faceStudioBodyInputsElements = [];
        [["front-side", "Front Side"], ["right-side", "Right Side"], ["left-side", "Left Side"]].forEach((side) => {
            faceStudioBodyInputsElements.push(this.PrepareFileInputControl({
                section: faceStudioInputs.id,
                text: side[1],
                id: side[0]
            }));
        });

        faceStudioBodyInputs.push({
            elements: faceStudioBodyInputsElements
        });

        const faceStudioBody = [];
        const faceStudio = {
            header: "Face Studio",
            id: "face-studio",
            body: faceStudioBody,
            style: null,
            class: ["mb-3"]
        };

        const faceStudioBodyElements = [];
        faceStudioBody.push({
            elements: faceStudioBodyElements
        });

        const canvasBody = [];
        const canvas = {
            header: "Canvas",
            id: "canvas",
            body: canvasBody,
            style: null,
            class: ["mb-3"]
        };

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("btn-group-vertical", "w-100");
        buttonsContainer.setAttribute("role", "group");

        buttonsContainer.appendChild(this.PrepareButtonControl({
            id: canvas.id,
            section: "toggle",
            text: "Click to show",
            class: ["btn-warning"],
            click: this.UIMenuItemToggleContentClickHandler.bind(this)
        }));

        buttonsContainer.appendChild(this.PrepareButtonControl({
            id: canvas.id,
            section: "clear",
            text: "Click to refresh",
            class: ["btn-success"],
            click: this.UIMenuItemClearContentClickHandler.bind(this)
        }));

        const canvasBodyElements = [buttonsContainer];

        this.PrepareDrawingOptionControl({
            options: [{
                id: "pattern",
                text: "Pattern",
                click: this.UIMenuItemCanvasDrawingPatternChangeHandler.bind(this),
                options: [{
                    id: "none",
                    text: "None",
                    disabled: ""
                }, {
                    id: "circle",
                    text: "Circle",
                    disabled: ""
                }, {
                    id: "rect",
                    text: "Rectangle",
                    disabled: ""
                }, {
                    id: "ellipse",
                    text: "Ellipse",
                    disabled: ""
                }]
            }, {
                id: "mode",
                text: "Mode",
                click: this.UIMenuItemCanvasDrawingModeChangeHandler.bind(this),
                options: [{
                    id: "none",
                    text: "None",
                    disabled: ""
                }, {
                    id: "fill",
                    text: "Fill",
                    disabled: ""
                }, {
                    id: "stroke",
                    text: "Stroke",
                    disabled: ""
                }]
            }, {
                id: "path",
                text: "Path",
                click: this.UIMenuItemCanvasDrawingPathChangeHandler.bind(this),
                options: [{
                    id: "none",
                    text: "None",
                    disabled: ""
                }, {
                    id: "vertex",
                    text: "Vertex",
                    disabled: ""
                }, {
                    id: "radius",
                    text: "Radius",
                    disabled: "ellipse"
                }, {
                    id: "dia",
                    text: "Diametre",
                    disabled: "rect ellipse"
                }]
            }]
        })
            .forEach((option) => canvasBodyElements.push(option));

        canvasBody.push({
            elements: canvasBodyElements
        });

        return [viewer, faceStudio, faceStudioInputs, canvas];
    }
    PrepareCredits() {
        const creditMe = {
            header: "Hanga7yr",
            id: "me",
            body: [{
                elements: [
                    '<span>Made using <a href="https://threejs.org/" target="_blank" class="card-link">Three.js</a> as a means to learn how to use it.</span>',
                    '<span>Heavy use of <a href="https://getbootstrap.com/" target="_blank" class="card-link">Bootstrap</a> for the interface.</span>',
                    '<span>Custom canvas figure drawing classes (used most of the time on this)</span>'
                ]
            }, {
                elements: [
                    '<a href="https://www.reddit.com/user/hanga7yr" class="card-link" target="_blank">Reddit</a>',
                    '<a href="https://github.com/Hanga7yr" class="card-link" target="_blank">Github</a>',
                    'Discord (<span class="text-decoration-underline">Hangatyr#7060</span>)'
                ]
            }],
            style: null,
            class: ["mb-3"]
        };

        const creditModel = {
            header: "MikeMoore",
            id: "mike",
            body: [{
                elements: [
                    '<a href="https://skfb.ly/ouzsK" className="card-link" target="_blank">Base Male Head</a> <span>as is</span>',
                    '<a href="http://creativecommons.org/licenses/by/4.0/" class="card-link" target="_blank">Licensed under Creative Commons Attribution</a>'
                ]
            }],
            style: null,
            class: ["mb-3"]
        };

        return [creditMe, creditModel];
    }

    Generate() {
        const container = document.createElement("div");
        container.classList.add("container");
        container.style.height = "100vh";

        const row = document.createElement("div");
        row.classList.add("row");
        container.appendChild(row);

        const ui = this.GenerateUI(this.uiConfig);

        const content = this.GenerateContent(this.contentConfig);
        this.canvasHelper = new CanvasEventHelper(this.content.canvas.container);
        this.viewerHelper = new ViewerHelper(this.content.viewer.element);

        row.appendChild(ui);
        row.appendChild(content);
        document.body.prepend(container);

        this.canvasHelper.UpdateLayers();
        this.viewerHelper.UpdateViewer();
        this.viewerHelper.Animate();
    }

    GenerateContent(config = {threejs: null, canvas: null, class: null, style: null}) {
        const content = document.createElement("div");
        if(config && config.class)
            config.class.forEach((styleClass) => content.classList.add(styleClass));
        if(config && config.style)
            config.style.map((style) => Object.entries(style)).forEach(([[key, value]]) => content.style.setProperty(key, value));

        content.appendChild(this.GenerateThreeJSContainer(config && config.threejs ? config.threejs : null));
        content.appendChild(this.GenerateCanvasContainer(config && config.canvas ? config.canvas : null));
        this.content.viewer.element.classList.remove("d-none");

        this.content.element = content;
        return content;
    }
    GenerateCanvasContainer(config = {class: null, style: null}) {
        const canvasContainer = document.createElement("div");
        if(config && config.class)
            config.class.forEach((styleClass) => canvasContainer.classList.add(styleClass));
        if(config && config.style)
            config.style.map((style) => Object.entries(style)).forEach(([[key, value]]) => canvasContainer.style.setProperty(key, value));

        canvasContainer.setAttribute("data-need-refresh", "true");

        this.content.canvas.container = canvasContainer;
        return canvasContainer;
    }
    GenerateThreeJSContainer(config = {class: null, style: null}) {
        const threeJSContainer = document.createElement("div");
        if(config && config.class)
            config.class.forEach((styleClass) => threeJSContainer.classList.add(styleClass));
        if(config && config.style)
            config.style.map((style) => Object.entries(style)).forEach(([[key, value]]) => threeJSContainer.style.setProperty(key, value));

        threeJSContainer.setAttribute("data-need-refresh", "true");
        this.content.viewer.element = threeJSContainer;
        return threeJSContainer;
    }


    GenerateUI(config = {menu: null, control: null, style: null}) {
        const ui = document.createElement("div");
        ui.classList.add("d-flex");
        if(config && config.style)
            config.style.map((style) => Object.entries(style)).forEach(([[key, value]]) => ui.style.setProperty(key, value));
        if(config && config.class)
            config.class.forEach((styleClass) => ui.classList.add(styleClass));

        const uiCont = document.createElement("div")
        uiCont.classList.add("w-100", "collapse-horizontal");
        bootstrap.Collapse.getOrCreateInstance(uiCont, { toggle: true }); // Lets bootstrap add the classes.

        if(config && config.menu)
            uiCont.appendChild(this.GenerateMenu(config.menu));
        ui.appendChild(uiCont);
        if(config && config.control)
            ui.appendChild(this.GenerateUIControl(config.control));

        this.ui.element = uiCont;
        return ui;
    }
    GenerateUIControl(config= {content: null, onclick: null, class: null, style: null}){
        const uiControl = document.createElement("button");
        uiControl.classList.add("btn", "btn-secondary", "m-1");

        if(config && config.style)
            config.style.map((style) => Object.entries(style)).forEach(([[key, value]]) => uiControl.style.setProperty(key, value));
        if(config && config.class)
            config.class.forEach((styleClass) => uiControl.classList.add(styleClass));
        if(config && config.onclick) uiControl.addEventListener('click', config.onclick.bind(this));
        if(config && config.content) {
            if(config.content instanceof HTMLElement) {
                uiControl.appendChild(config.content);
            } else if(Array.isArray(config.content)) {
                config.content.forEach((item) => {
                    if(config.content instanceof HTMLElement) {
                        uiControl.appendChild(item);
                    } else uiControl.innerHTML = config.content;
                });
            } else uiControl.innerHTML = config.content;
        }

        this.ui.control.element = uiControl;
        return uiControl;
    }
    GenerateMenu(config = {items: null, class: null, style: null}) {
        const uiMenu = document.createElement("div");

        uiMenu.classList.add("accordion");
        uiMenu.setAttribute("id", "menu");
        if(config && config.style)
            config.style.map((style) => Object.entries(style)).forEach(([[key, value]]) => uiMenu.style.setProperty(key, value));
        if(config && config.class)
            config.class.forEach((styleClass) => uiMenu.classList.add(styleClass));
        if(config && config.items && Array.isArray(config.items))
            config.items.forEach((item) => {
                uiMenu.appendChild(this.AddMenuItem(item));
            });

        if(this.ui.menu.items.length != 0) {
            var menuItem = this.ui.menu.items[0];
            menuItem.element.parentElement.style.flexGrow = "1";
            menuItem.element.parentElement.style.overflowY = "auto";
            menuItem.control.classList.remove("collapsed");
            menuItem.element.classList.add("show");
        }
        this.ui.menu.element = uiMenu;
        return uiMenu;
    }
    AddMenuItem(config = {header: "Menu Item 1", id: null, content: null, onclick: null, style: null, class: null}) {
        const uiMenuItem = document.createElement("div");

        uiMenuItem.classList.add("accordion-item");
        uiMenuItem.style.flexGrow = "0";
        if(config && config.id) uiMenuItem.setAttribute("id", "menu-item-" + config.id);

        const uiMenuItemHeader = document.createElement("div");
        uiMenuItemHeader.classList.add("accordion-header");

        const uiMenuItemControl = document.createElement("button");
        uiMenuItemControl.setAttribute("data-bs-toggle", "collapse");
        if(config && config.id) uiMenuItemControl.setAttribute("data-bs-target", "#menu-item-body-" + config.id);
        if(config && config.id) uiMenuItemControl.setAttribute("aria-controls", "menu-item-body-" + config.id);
        uiMenuItemControl.setAttribute("aria-expanded", "false");
        uiMenuItemControl.setAttribute("type", "button");
        uiMenuItemControl.classList.add("accordion-button", "collapsed");

        if(config && config.id) uiMenuItemControl.setAttribute("id", "menu-item-btn-" + config.id);
        if(config && config.header) uiMenuItemControl.textContent = config.header;
        if(config && config.onclick) uiMenuItemControl.addEventListener('click', config.onclick.bind(this));
        if(config && config.style)
            config.style.map((style) => Object.entries(style)).forEach(([[key, value]]) => uiMenuItemControl.style.setProperty(key, value));
        if(config && config.class)
            config.class.forEach((styleClass) => uiMenuItemControl.classList.add(styleClass));

        const uiMenuItemBody = document.createElement("div");
        uiMenuItemBody.classList.add("accordion-collapse", "collapse");
        if(config && config.id) uiMenuItemBody.setAttribute("id", "menu-item-body-" + config.id);
        if(config && config.id) uiMenuItemBody.setAttribute("aria-labelledby", "menu-item-btn-" + config.id);
        if(config && config.id) uiMenuItemBody.setAttribute("data-bs-parent", "#menu");

        const uiMenuItemBodyCont = document.createElement("div");
        uiMenuItemBodyCont.classList.add("accordion-body");
        uiMenuItemBody.appendChild(uiMenuItemBodyCont);

        this.ui.menu.items.push({
            element: uiMenuItemBody,
            control: uiMenuItemControl,
            header: uiMenuItemHeader,
            body: []
        });
        if(config && config.content)
            if(Array.isArray(config.content)) {
                config.content.forEach((content) => {
                    uiMenuItemBodyCont.appendChild(this.GenerateItemSection(content));
                });
            } else uiMenuItemBodyCont.appendChild(config.content);

        uiMenuItemHeader.appendChild(uiMenuItemControl);
        uiMenuItem.appendChild(uiMenuItemHeader);
        uiMenuItem.appendChild(uiMenuItemBody);

        return uiMenuItem;
    }
    GenerateItemSection(config = {header: null, id: null, body: null, style: null, class: null}) {
        const card = document.createElement("div");

        card.classList.add("card");
        if(config && config.class)
            config.class.forEach((styleClass) => card.classList.add(styleClass));
        if(config && config.style) card.style = config.style;
        const row = document.createElement("div");
        row.classList.add("row", "g-0");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        if(config && config.id) cardBody.setAttribute("id", "menu-item-section-body-" + config.id);

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        if(config && config.id) cardTitle.setAttribute("id", "menu-item-section-title-" + config.id);

        cardBody.appendChild(cardTitle);

        if(config) {
            if (config.header) cardTitle.textContent = config.header;
            if (config.body) {
                const sections = [];
                if(Array.isArray(config.body)) {
                    config.body.forEach((bodyPart) => {
                        const cardBodyList = document.createElement("ul");
                        cardBodyList.classList.add("list-group", "list-group-flush");

                        const parts = [];
                        if(bodyPart && bodyPart.elements
                            && Array.isArray(bodyPart.elements))
                            bodyPart.elements.forEach((item) => {
                                const bodyItem = document.createElement("li");
                                bodyItem.classList.add("list-group-item");

                                if(item instanceof Element)
                                    bodyItem.appendChild(item);
                                else
                                    bodyItem.innerHTML = item;
                                cardBodyList.appendChild(bodyItem);
                                parts.push(bodyItem);
                            });
                        cardBody.appendChild(cardBodyList);
                        sections.push({
                            element: cardBodyList,
                            elements: parts
                        });
                    });
                } else cardBody.appendChild(config.body);
                this.ui.menu.items.at(-1).body.push({
                    element: cardBody,
                    sections: sections
                })
            }
        }

        row.appendChild(cardBody);
        card.appendChild(row);
        return card;
    }

    UIControlClickHandler(e) {
        bootstrap.Collapse.getOrCreateInstance(app.ui.element, {toggle: false}).toggle();

        if(this.uiConfig.class.some(uiClass => app.ui.element.parentElement.classList.contains(uiClass))) {
            this.uiConfig.class.forEach(uiClass => app.ui.element.parentElement.classList.remove(uiClass));
            app.ui.element.parentElement.classList.add("col-1");
        } else {
            app.ui.element.parentElement.classList.remove("col-1");
            this.uiConfig.class.forEach(uiClass => app.ui.element.parentElement.classList.add(uiClass));
        }
        if(this.contentConfig.class.some(contentClass => app.content.element.classList.contains(contentClass))) {
            this.contentConfig.class.forEach(contentClass => app.content.element.classList.remove(contentClass));
            app.content.element.classList.add("col-11");
        }else {
            app.content.element.classList.remove("col-11");
            this.contentConfig.class.forEach(contentClass => app.content.element.classList.add(contentClass));
        }

        this.canvasHelper.UpdateLayers();
        this.viewerHelper.UpdateViewer();
    }
    UIMenuItemClickHandler(e) {
        app.ui.menu.items
            .filter(menuItem => menuItem.control == this)
            .map(menuItem => menuItem)
            .forEach(menuItem => {
                menuItem.element.parentElement.style.flexGrow = "1"
                menuItem.element.parentElement.style.overflowY = "scroll";
                if(menuItem.control.classList.contains("collapsed")) {
                    menuItem.element.parentElement.style.flexGrow = "0";
                    menuItem.element.parentElement.style.overflowY = "visible"; // When hidden
                }
            });
        app.ui.menu.items
            .filter(menuItem => menuItem.control !== this)
            .map(menuItem => menuItem)
            .forEach(menuItem => {
                menuItem.element.parentElement.style.flexGrow = "0";
                menuItem.element.parentElement.style.overflowY = "visible"; // When hidden
                bootstrap.Collapse.getOrCreateInstance(menuItem.element, {toggle: false}).show();
                if(!menuItem.control.classList.contains("collapsed")) {
                    menuItem.element.parentElement.style.flexGrow = "1";
                    menuItem.element.parentElement.style.overflowY = "scroll";
                }
            });
    }
    UIMenuItemFileInputChangeHandler(e) {
        const inputElement = document.getElementById(e.target.getAttribute("id").replace("-inputField", "-btn"));
        inputElement.classList.remove("btn-danger");
        inputElement.classList.add("btn-success");
        inputElement.removeAttribute("disabled");
    }
    UIMenuItemFileInputClickHandler(e) {
        document.getElementById("menu-item-section-body-canvas").scrollIntoView(true);
    }

    UIMenuItemCanvasDrawingPathChangeHandler(e) {
        const path = e.target.getAttribute("data-drawing-path");
        switch (path) {
            case "vertex":
                this.canvasHelper.patternHelper.drawingPathMode = CanvasPatternHelper.PATH_VERTEX;
                break;
            case "radius":
                this.canvasHelper.patternHelper.drawingPathMode = CanvasPatternHelper.PATH_RADIUS;
                break;
            case "dia":
                this.canvasHelper.patternHelper.drawingPathMode = CanvasPatternHelper.PATH_DIA;
                break;
            case "none":
            default:
                this.canvasHelper.patternHelper.drawingPathMode = CanvasPatternHelper.PATH_NONE;
                break;
        }
    }
    UIMenuItemCanvasDrawingModeChangeHandler(e) {
        const mode = e.target.getAttribute("data-drawing-mode");
        switch (mode) {
            case "fill":
                this.canvasHelper.patternHelper.drawingMode = CanvasPatternHelper.MODE_FILL;
                break;
            case "stroke":
                this.canvasHelper.patternHelper.drawingMode = CanvasPatternHelper.MODE_STROKE;
                break;
            case "none":
            default:
                this.canvasHelper.patternHelper.drawingMode = CanvasPatternHelper.MODE_NONE;
                this.canvasHelper.patternHelperAux.shouldDraw = false;
                break;
        }
    }
    UIMenuItemCanvasDrawingPatternChangeHandler(e) {
        const pattern = e.target.getAttribute("data-drawing-pattern");
        const paths = document.getElementsByName(e.target.getAttribute('name').replace('pattern', 'path'));
        paths.forEach((path) => {
            path.removeAttribute("disabled");
            if(path.getAttribute("data-drawing-disabled-pattern").includes(pattern))
                path.setAttribute("disabled", null);
        });

        switch (pattern) {
            case "rect":
                this.canvasHelper.patternHelper.drawingPattern = CanvasPatternHelper.PATTERN_RECT;
                this.canvasHelper.patternHelperAux.shouldDraw = false;
                break;
            case "circle":
                this.canvasHelper.patternHelper.drawingPattern = CanvasPatternHelper.PATTERN_CIRCLE;
                this.canvasHelper.patternHelperAux.shouldDraw = true;
                break;
            case "ellipse":
                this.canvasHelper.patternHelper.drawingPattern = CanvasPatternHelper.PATTERN_ELLIPSE;
                this.canvasHelper.patternHelperAux.shouldDraw = true;
                break;
            case "none":
            default:
                this.canvasHelper.patternHelper.drawingPattern = CanvasPatternHelper.PATTERN_NONE;
                this.canvasHelper.patternHelperAux.shouldDraw = false;
                break;
        }
    }
    UIMenuItemToggleContentClickHandler(e) {
        if(e.target.getAttribute("id").includes('canvas')) {
            this.content.viewer.element.classList.add("d-none");
            this.content.canvas.container.classList.remove("d-none");

            this.content.viewer.element.setAttribute("data-need-refresh", "true");

            if(this.content.canvas.container.getAttribute("data-need-refresh") == "true") {
                this.content.canvas.container.setAttribute("data-need-refresh", "false");
                this.canvasHelper.UpdateLayers();
            }
        } else {
            this.content.viewer.element.classList.remove("d-none");
            this.content.canvas.container.classList.add("d-none");

            this.content.canvas.container.setAttribute("data-need-refresh", "true");

            if(this.content.viewer.element.container.getAttribute("data-need-refresh") == "true") {
                this.content.viewer.element.setAttribute("data-need-refresh", "true");
                this.viewerHelper.UpdateViewer();
            }
        }
    }
    UIMenuItemClearContentClickHandler(e) {
        this.canvasHelper.UpdateLayers();
    }
}

export const app = new App();
app.Generate();