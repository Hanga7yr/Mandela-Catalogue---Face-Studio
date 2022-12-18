import { ViewerHelper } from '/js/app/ViewerHelper.js';
import { CanvasHelper } from "/js/app/CanvasHelper.js";
7
import { CanvasDrawingHelper } from "/js/app/CanvasDrawingHelper.js";
import { CanvasPatternHelper } from "/js/app/CanvasPatternHelper.js";
import { CanvasUVHelper } from "/js/app/CanvasUVHelper.js";
import { UIHelper } from "/js/app/UIHelper.js";

export class App {
    /**
     * Stores the CanvasHelper object. Maybe it should be a singleton but meh.
     * @type {CanvasHelper}
     */
    canvasHelper;

    /**
     * Stores the ViewerHelper object.
     * @type {ViewerHelper}
     */
    viewerHelper;

    /**
     * The parent element of the canvas.
     * @type {HTMLElement}
     */
    canvasContainer = null;


    /**
     * @property {UIHelper.GenericElement}         [parent]
     * @property {UIHelper.GenericElement}         [container]
     * @property {HTMLElement}                     [menu]
     * @property {UIHelper.GenericElement}         [control]
     */
    ui;

    /**
     * @type {UIHelper.GenericElement}
     */
    content;

    constructor(props) {
        this.canvasHelper = new CanvasHelper();
        this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN).AddOnChangePatternEventHandler(this.UIMenuItemCanvasOptionPatternChange.bind(this));

        this.uiConfig = {};
        this.uiConfig.parent = {};
        this.uiConfig.parent.class = ["col-4"];
        this.uiConfig.parent.id = "ui-menu";

        this.uiConfig.control = {};
        this.uiConfig.control.content = "+";
        this.uiConfig.control.class = ["btn-primary"];
        this.uiConfig.control.events = [{
            event: "click",
            handlers: [
                this.UIControlClickHandler.bind(this)
            ]
        }];

        this.uiConfig.container = {};
        this.uiConfig.container.id = "ui-menu-container";

        this.uiConfig.menu = {};
        this.uiConfig.menu = UIHelper.PrepareMenuElement({
            items: [
                UIHelper.PrepareMenuItemElement({
                    control: { content: "Controls"},
                    container: { id: "ui-menu-1", attributes: [{property: "data-bs-parent", value: "#"+"ui-menu-container"}]},
                    sections: [
                        UIHelper.PrepareMenuItemSectionElement({
                            header: { content: "3D Viewer", id: "viewer" },
                            panels: [
                                {
                                    tag: "button",
                                    content: "Click to Show",
                                    class: ["btn", "btn-warning", "w-100"],
                                    attributes: [{property: "data-target", value: "viewer"}]
                                },
                                { content: 'Left-mouse to rotate' },
                                { content: 'Scroll to move in-out'},
                                { content: 'Right-mouse to move'  },
                            ]
                        }),
                        UIHelper.PrepareMenuItemSectionElement({
                            header: { content: "Face Studio", id: "face-studio" },
                        }),
                        UIHelper.PrepareMenuItemSectionElement({
                            header: { content: "Face Studio File Input", id: "face-studio-inputs" },
                            panels: [
                                UIHelper.PrepareFileInputElement({
                                    label: { content: "Front Side" },
                                    button: { content: "Process" }
                                }),
                                UIHelper.PrepareFileInputElement({
                                    label: { content: "Left Side" },
                                    button: { content: "Process" }
                                }),
                                UIHelper.PrepareFileInputElement({
                                    label: { content: "Right Side" },
                                    button: { content: "Process" }
                                }),
                            ]
                        }),
                        UIHelper.PrepareMenuItemSectionElement({
                            parent: { id: "ui-menu-canvas" },
                            header: { content: "Canvas"},
                            panels: [
                                UIHelper.CreateOrUpdateElement({
                                    class: ["btn-group-vertical", "w-100"],
                                    content: [
                                        UIHelper.CreateOrUpdateElement({
                                            tag         : "button",
                                            content     : "Click to Toggle",
                                            class       : ["btn", "btn-warning", "w-100"],
                                            attributes  : [ { property: "data-target", value: "canvas" } ],
                                            events      : [{
                                                event: "click",
                                                handlers: [ this.UIMenuItemToggleContentClickHandler.bind(this) ]
                                            }]
                                        }),
                                        UIHelper.CreateOrUpdateElement({
                                            tag         : "button",
                                            content     : "Click to Refresh",
                                            class       : ["btn", "btn-success", "w-100"],
                                            events      : [{
                                                event: "click",
                                                handlers: [ this.UIMenuItemClearContentClickHandler.bind(this) ]
                                            }]
                                        })
                                    ]
                                }),
                                UIHelper.PrepareImagePreviewElement({
                                    parent: { id: "canvas-img-prev", class: ["d-none"]},
                                    button: { content: "As Background", events: [{event: "click", handlers: [this.UIMenuItemImagePrevAsContentClickHandler.bind(this)]}]}
                                }),
                                UIHelper.PrepareOptionPanelElement({
                                    header      : { class: ["fs-5"], content: "Pattern" },
                                    container   : { class: ["btn-group-vertical"] },
                                    options     : [
                                        {
                                            label   : { content: "None" },
                                            item    : {
                                                id: `canvas-${CanvasPatternHelper.PATTERN}-${CanvasPatternHelper.PATTERN_NONE}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATTERN}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATTERN },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATTERN_NONE },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        },
                                        {
                                            label   : { content: "Rectangle" },
                                            item    : {
                                                id: `canvas-${CanvasPatternHelper.PATTERN}-${CanvasPatternHelper.PATTERN_RECT}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATTERN}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATTERN },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATTERN_RECT },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        },
                                        {
                                            label   : { content: "Circle" },
                                            item    : {
                                                id: `canvas-${CanvasPatternHelper.PATTERN}-${CanvasPatternHelper.PATTERN_CIRCLE}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATTERN}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATTERN },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATTERN_CIRCLE },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        },
                                        {
                                            label   : { content: "Ellipse" },
                                            item    : {
                                                id: `canvas-${CanvasPatternHelper.PATTERN}-${CanvasPatternHelper.PATTERN_ELLIPSE}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATTERN}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATTERN },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATTERN_ELLIPSE },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        },
                                        {
                                            label   : { content: "Image" },
                                            item    : {
                                                id: `canvas-${CanvasPatternHelper.PATTERN}-${CanvasPatternHelper.PATTERN_IMAGE}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATTERN}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATTERN },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATTERN_IMAGE },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        },
                                    ]
                                }),
                                UIHelper.PrepareOptionPanelElement({
                                    header      : { class: ["fs-5"], content: "Mode" },
                                    container   : { class: ["btn-group-vertical"] },
                                    options     : [
                                        {
                                            label: { content: "None" },
                                            item: {
                                                id: `canvas-${CanvasPatternHelper.MODE}-${CanvasPatternHelper.MODE_NONE}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.MODE}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.MODE },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.MODE_NONE },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        }, {
                                            label: { content: "Fill" },
                                            item: {
                                                id: `canvas-${CanvasPatternHelper.MODE}-${CanvasPatternHelper.MODE_FILL}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.MODE}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.MODE },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.MODE_FILL },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        }, {
                                            label: { content: "Stroke" },
                                            item: {
                                                id: `canvas-${CanvasPatternHelper.MODE}-${CanvasPatternHelper.MODE_STROKE}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.MODE}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.MODE },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.MODE_STROKE },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        },
                                    ]
                                }),
                                UIHelper.PrepareOptionPanelElement({
                                    header      : { class: ["fs-5"], content: "Path" },
                                    container   : { class: ["btn-group-vertical"] },
                                    options     : [
                                        {
                                            label: { content: "None" },
                                            item: {
                                                id: `canvas-${CanvasPatternHelper.PATH}-${CanvasPatternHelper.PATH_NONE}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATH}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATH },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATH_NONE },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        }, {
                                            label: { content: "Vertex" },
                                            item: {
                                                id: `canvas-${CanvasPatternHelper.PATH}-${CanvasPatternHelper.PATH_VERTEX}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATH}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATH },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATH_VERTEX },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        }, {
                                            label: { content: "Radius" },
                                            item: {
                                                id: `canvas-${CanvasPatternHelper.PATH}-${CanvasPatternHelper.PATH_RADIUS}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATH}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATH },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATH_RADIUS },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        },  {
                                            label: { content: "Dia" },
                                            item: {
                                                id: `canvas-${CanvasPatternHelper.PATH}-${CanvasPatternHelper.PATH_DIA}`,
                                                attributes: [
                                                    { property: "name", value: `canvas-${CanvasPatternHelper.PATH}` },
                                                    { property: "data-drawing-target", value: CanvasPatternHelper.PATH },
                                                    { property: "data-drawing-value", value: CanvasPatternHelper.PATH_DIA },
                                                ],
                                                events: [
                                                    { event: "click", handlers: [ this.UIMenuItemCanvasOptionChangeHandler.bind(this) ] }
                                                ]
                                            }
                                        }
                                    ]
                                }),
                            ]
                        })
                    ]
                }),
                UIHelper.PrepareMenuItemElement({
                    control: { content: "Credits"},
                    container: { id: "ui-menu-2", attributes: [{property: "data-bs-parent", value: "#"+"ui-menu-container"}]},
                    sections: [
                        UIHelper.PrepareMenuItemSectionElement({
                            id: "me",
                            header: { content: "Hanga7yr", class: ["fs-4"] },
                            title: { content: "Developer", class: ["fs-5"] },
                            subtitle: { content: "Main", class: ["fs-6"]  },
                            panels: [
                                UIHelper.PrepareMenuItemSectionListElement({
                                    header: { content: "Reason", class: ["fs-6"] },
                                    items: [
                                        { content: '<span>Made using <a href="https://threejs.org/" target="_blank" class="card-link">Three.js</a> as a means to learn how to use it</span>' },
                                        { content: '<span>Heavy use of <a href="https://getbootstrap.com/" target="_blank" class="card-link">Bootstrap</a> for the interface</span>' },
                                        { content: '<span>Custom canvas figure drawing and ui creation (used most of the time on this)</span>' },
                                    ]
                                }),
                                UIHelper.PrepareMenuItemSectionListElement({
                                    header: { content: "Socials", class: ["fs-6"] },
                                    items: [
                                        { content: '<a href="https://www.reddit.com/user/hanga7yr" class="card-link" target="_blank">Reddit</a>' },
                                        { content: '<a href="https://github.com/Hanga7yr" class="card-link" target="_blank">Github</a>' },
                                        { content: 'Discord (<span class="text-decoration-underline">Hangatyr#7060</span>)' },
                                    ]
                                })
                            ]
                        }),
                        UIHelper.PrepareMenuItemSectionElement({
                            id: "mike",
                            header: { content: "MikeMoore", class: ["fs-4"] },
                            title: { content: "Assets", class: ["fs-5"] },
                            panels: [
                                UIHelper.PrepareMenuItemSectionListElement({
                                    header: { content: "Credits", class: ["fs-6"] },
                                    items: [
                                        { content: '<a href="https://skfb.ly/ouzsK" className="card-link" target="_blank">Base Male Head</a> <span>as is</span>' },
                                        { content: '<a href="http://creativecommons.org/licenses/by/4.0/" class="card-link" target="_blank">Licensed under Creative Commons Attribution</a>' },
                                    ]
                                }),
                            ]
                        })
                    ]
                })
            ]
        });

        this.contentConfig = {};
        this.contentConfig.id = "content";
        this.contentConfig.class = ["col-8"];
        this.contentConfig.content = [
            UIHelper.CreateOrUpdateElement({
                id          : "viewer-container",
                class       : ["h-100"],
                style       : [{property: "min-height", value: "100vh"}],
                attributes  : [{property: "data-need-refresh", value: "true"}]
            }), UIHelper.CreateOrUpdateElement({
                id          : "canvas-container",
                class       : ["position-relative", "border", "border-dark", "d-none"],
                style       : [{property: "min-height", value: "100vh"}],
                attributes  : [{property: "data-need-refresh", value: "true"}],
            })
        ];
    }

    Generate() {
        document.body.prepend(UIHelper.CreateOrUpdateElement({
            class: ["container"],
            style: [ {property: "height", value: "100vh"} ],
            content: UIHelper.CreateOrUpdateElement({
                class: ["row"],
                content: [
                    UIHelper.PrepareUIElement(this.uiConfig),
                    UIHelper.CreateOrUpdateElement(this.contentConfig)
                ]
            })
        }));

        // Change the selected to default and update others.
        this.UIMenuItemCanvasOptionPatternChange(CanvasPatternHelper.PATTERN_NONE, [0], [0]);

        this.canvasHelper.SetParentElement(document.getElementById("canvas-container"));
        this.canvasHelper.Generate();

        this.viewerHelper = new ViewerHelper(document.getElementById("viewer-container"));
        this.viewerHelper.UpdateViewer();

        this.canvasHelper.UpdateLayers();
        this.viewerHelper.Animate();
    }

    UIControlClickHandler(e) {
        const uiContainer = document.getElementById("ui-menu");
        const contentContainer = document.getElementById("content");

        bootstrap.Collapse.getOrCreateInstance(document.getElementById("ui-menu"), {toggle: false}).toggle();

        if(uiContainer.classList.contains("col-4")) {
            uiContainer.classList.add("col-1");
            uiContainer.classList.remove("col-4");
        } else {
            uiContainer.classList.add("col-4");
            uiContainer.classList.remove("col-1");
        }

        if(contentContainer.classList.contains("col-8")) {
            contentContainer.classList.add("col-11");
            contentContainer.classList.remove("col-8");
        }else {
            contentContainer.classList.add("col-8");
            contentContainer.classList.remove("col-11");
        }

        this.canvasHelper.UpdateLayers();
        this.viewerHelper.UpdateViewer();
    }
    UIMenuItemFileInputClickHandler(e) {
        document.getElementById("menu-item-section-body-canvas").scrollIntoView(true);

        createImageBitmap(e.target.previousElementSibling.files[0])
            .then((fileImageBitmap) => {
                document.getElementById("controls-img-prev-canvas-img").src = URL.createObjectURL(e.target.previousElementSibling.files[0]);

                this.ui.menu.items[0].body
                    .filter(element => element.element.getAttribute("id").includes("ui-canvas"))[0]
                    .sections[0].elements[2].firstElementChild.lastElementChild
                    .querySelector("input")
                    .click();
                this.ui.menu.items[0].body
                    .filter(element => element.element.getAttribute("id").includes("ui-canvas"))[0]
                    .sections[0].elements[0].firstElementChild.firstElementChild.click();

                this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN).image = fileImageBitmap;
            });

        // createImageBitmap(this.previousElementSibling.files[0]).then(function(fileImageBitmap) {
        //     canvasHelper.GetDrawingLayer().drawImage(fileImageBitmap, 0, 0);
        // });
    }


    /**
     *
     * @param {number} pattern
     * @param {number[]} modeAvailable
     * @param {number[]} pathAvailable
     * @constructor
     */
    UIMenuItemCanvasOptionPatternChange(pattern, modeAvailable, pathAvailable) {
        if(modeAvailable && Array.isArray(modeAvailable)) {
            CanvasPatternHelper
                .MODES
                .map((mode) => document.getElementById(`canvas-${CanvasPatternHelper.MODE}-${mode}`))
                .forEach((option) => {
                    option.setAttribute("disabled", "");
                    option.parentElement.querySelector(`[for='${option.getAttribute("id")}']`).classList.add("btn-danger");
                });
            CanvasPatternHelper
                .MODES
                .filter((mode) => modeAvailable.includes(mode))
                .map((mode) => document.getElementById(`canvas-${CanvasPatternHelper.MODE}-${mode}`))
                .forEach((option) => {
                    option.removeAttribute("disabled");
                    option.parentElement.querySelector(`[for='${option.getAttribute("id")}']`).classList.remove("btn-danger");
                    option.parentElement.firstElementChild.click();
                });
        }

        if(pathAvailable && Array.isArray(pathAvailable)) {
            CanvasPatternHelper
                .PATHS
                .map((path) => document.getElementById(`canvas-${CanvasPatternHelper.PATH}-${path}`))
                .forEach((option) => {
                    option.setAttribute("disabled", "");
                    option.parentElement.querySelector(`[for='${option.getAttribute("id")}']`).classList.add("btn-danger");
                });

            CanvasPatternHelper
                .PATHS
                .filter((path) => pathAvailable.includes(path))
                .map((path) => document.getElementById(`canvas-${CanvasPatternHelper.PATH}-${path}`))
                .forEach((option) => {
                    option.removeAttribute("disabled");
                    option.parentElement.querySelector(`[for='${option.getAttribute("id")}']`).classList.remove("btn-danger");
                    option.parentElement.firstElementChild.click();
                });
        }

        switch (pattern) {
            case CanvasPatternHelper.PATTERN_CIRCLE:
            case CanvasPatternHelper.PATTERN_ELLIPSE:
                this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN_OUTLINE).shouldDraw = true;
                break;
            case CanvasPatternHelper.PATTERN_IMAGE:
                document.getElementById("ui-menu-canvas").querySelector("#canvas-img-prev").classList.remove("d-none");
                this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN_OUTLINE).shouldDraw = false;
                break;
            default:
                document.getElementById("ui-menu-canvas").querySelector("#canvas-img-prev").classList.add("d-none");
                this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN_OUTLINE).shouldDraw = false;
                break;
        }
    }
    UIMenuItemCanvasOptionChangeHandler(e) {
        const option = parseInt(e.target.getAttribute("data-drawing-target"));
        const value = parseInt(e.target.getAttribute("data-drawing-value"));
        switch (option) {
            case CanvasPatternHelper.PATTERN:
                this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN).ChangePattern(value);
                break;
            case CanvasPatternHelper.MODE:
                this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN).ChangeMode(value);
                break;
            case CanvasPatternHelper.PATH:
                this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN).ChangePath(value);
                break;
        }
    }

    UIMenuItemToggleContentClickHandler(e) {
        const viewerContainer = document.getElementById("viewer-container");
        const canvasContainer = document.getElementById("canvas-container");

        if(e.target.getAttribute("data-target").includes('canvas')) {
            viewerContainer.classList.add("d-none");
            canvasContainer.classList.remove("d-none");

            viewerContainer.setAttribute("data-need-refresh", "true");

            if(canvasContainer.getAttribute("data-need-refresh") == "true") {
                canvasContainer.setAttribute("data-need-refresh", "false");
                this.canvasHelper.UpdateLayers();
            }
        } else {
            viewerContainer.classList.remove("d-none");
            canvasContainer.classList.add("d-none");

            canvasContainer.setAttribute("data-need-refresh", "true");

            if(viewerContainer.getAttribute("data-need-refresh") == "true") {
                viewerContainer.setAttribute("data-need-refresh", "true");
                this.viewerHelper.UpdateViewer();
            }
        }
    }

    UIMenuItemClearContentClickHandler(e) {
        this.canvasHelper.UpdateLayers();
    }
    UIMenuItemImagePrevAsContentClickHandler(e) {
        this.canvasHelper.GetHelper(CanvasDrawingHelper.TYPE_PATTERN).DrawImageAsBackground();
    }
}

export const app = new App();
app.Generate();