import { CanvasShapeHelper } from '/js/Canvas/CanvasShapeHelper.js';
import { CanvasMovingHelper } from '/js/Canvas/CanvasMovingHelper.js';
import { CanvasEventHelper } from '/js/Canvas/CanvasEventHelper.js';
import { CanvasUVHelper } from '/js/Canvas/CanvasUVHelper.js';
import { UIHelper } from '/js/UI/UIHelper.js';
import { UIEventHelper } from '/js/UI/UIEventHelper.js';

export class App {

    /**
     * @property {UIHelper.GenericElement}         [parent]
     * @property {UIHelper.GenericElement}         [container]
     * @property {HTMLElement}                     [menu]
     * @property {UIHelper.GenericElement}         [control]
     */
    uiConfig;
    /**
     * @type {UIHelper.GenericElement}
     */
    contentConfig;

    /** @type {CanvasShapeHelper} */
    shapeHelper;
    /** @type {CanvasEventHelper} */
    eventHelper;
    /** @type {UV} */
    uvHelper;

    constructor() {


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
                                    button: {
                                        content: "Process",
                                        events: [{ event: "click", handlers: [ this.UIMenuItemFileInputClickHandler.bind(this) ] }],
                                        attributes: [{ property: "data-target", value: CanvasUVHelper.SIDE_FRONT }]
                                    }
                                }),
                                UIHelper.PrepareFileInputElement({
                                    label: { content: "Left Side" },
                                    button: {
                                        content: "Process",
                                        events: [{ event: "click", handlers: [ this.UIMenuItemFileInputClickHandler.bind(this) ] }],
                                        attributes: [{ property: "data-target", value: CanvasUVHelper.SIDE_LEFT }]
                                    }
                                }),
                                UIHelper.PrepareFileInputElement({
                                    label: { content: "Right Side" },
                                    button: {
                                        content: "Process",
                                        events: [{ event: "click", handlers: [ this.UIMenuItemFileInputClickHandler.bind(this) ] }],
                                        attributes: [{ property: "data-target", value: CanvasUVHelper.SIDE_RIGHT }]
                                    }
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
                                            content     : "Click to Show",
                                            class       : ["btn", "btn-warning", "w-100"],
                                            attributes  : [ { property: "data-target", value: "canvas" } ],
                                            events      : [{
                                                event: "click",
                                                handlers: [ this.UIMenuItemToggleContentClickHandler.bind(this) ]
                                            }]
                                        }),
                                        UIHelper.CreateOrUpdateElement({
                                            tag         : "button",
                                            content     : "Click to Clear",
                                            class       : ["btn", "btn-success", "w-100"],
                                            events      : [{
                                                event: "click",
                                                handlers: [ this.UIMenuItemClearContentClickHandler.bind(this) ]
                                            }]
                                        }),
                                        UIHelper.CreateOrUpdateElement({
                                            tag: "button",
                                            id: "canvas-toggle-uv-btn",
                                            class: ["btn", "btn-danger", "w-100"],
                                            content: "Show UV Mapping",
                                            events: [{ event: "click", handlers: [ this.CanvasToggleUVEventHandler.bind(this) ] }]
                                        })
                                    ]
                                }),
                                UIHelper.CreateOrUpdateElement({
                                    content: [
                                        UIHelper.PrepareOptionPanelElement({
                                            header      : { class: ["fs-5"], content: "Side" },
                                            container   : { class: [] },
                                            options     : [
                                                {
                                                    label   : { content: "None" },
                                                    item: {
                                                        id: `canvas-side-${CanvasUVHelper.SIDE_NONE}`,
                                                        attributes: [
                                                            { property: "name", value: `face-studio-face-side` },
                                                            { property: "data-target", value: CanvasUVHelper.SIDE_NONE },
                                                            { property: "value", value: CanvasUVHelper.SIDE_NONE },
                                                        ],
                                                        events: [
                                                            { event: "click", handlers: [ this.UIMenuItemSideChangeEventHandler.bind(this) ] }
                                                        ]
                                                    },
                                                },
                                                {
                                                    label   : { content: "Front Side" },
                                                    item: {
                                                        id: `canvas-side-${CanvasUVHelper.SIDE_FRONT}`,
                                                        attributes: [
                                                            { property: "name", value: `face-studio-face-side` },
                                                            { property: "data-target", value: CanvasUVHelper.SIDE_FRONT },
                                                            { property: "value", value: CanvasUVHelper.SIDE_FRONT },
                                                        ],
                                                        events: [
                                                            { event: "click", handlers: [ this.UIMenuItemSideChangeEventHandler.bind(this) ] }
                                                        ]
                                                    },
                                                },
                                                {
                                                    label   : { content: "Left Side" },
                                                    item: {
                                                        id: `canvas-side-${CanvasUVHelper.SIDE_LEFT}`,
                                                        attributes: [
                                                            { property: "name", value: `face-studio-face-side` },
                                                            { property: "data-target", value: CanvasUVHelper.SIDE_LEFT },
                                                            { property: "value", value: CanvasUVHelper.SIDE_LEFT },
                                                        ],
                                                        events: [
                                                            { event: "click", handlers: [ this.UIMenuItemSideChangeEventHandler.bind(this) ] }
                                                        ]
                                                    },
                                                },
                                                {
                                                    label   : { content: "Right Side" },
                                                    item: {
                                                        id: `canvas-side-${CanvasUVHelper.SIDE_RIGHT}`,
                                                        attributes: [
                                                            { property: "name", value: `face-studio-face-side` },
                                                            { property: "data-target", value: CanvasUVHelper.SIDE_RIGHT },
                                                            { property: "value", value: CanvasUVHelper.SIDE_RIGHT },
                                                        ],
                                                        events: [
                                                            { event: "click", handlers: [ this.UIMenuItemSideChangeEventHandler.bind(this) ] }
                                                        ]
                                                    },
                                                },
                                            ]
                                        }),
                                        UIHelper.CreateOrUpdateElement({
                                            tag: "button",
                                            id: "canvas-side-btn",
                                            class: ["btn", "btn-danger", "w-100"],
                                            attributes: [{ property: "disabled", value: "" }],
                                            content: "Save mask",
                                            events: [{ event: "click", handlers: [ this.UIMenuItemSaveSideMask.bind(this) ] }]
                                        }),
                                    ]
                                }),
                                UIHelper.PrepareImagePreviewElement({
                                    parent: { id: "canvas-img-prev", class: ["d-none"]},
                                    element: { id: "canvas-img-prev-input", },
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


    /**
     * Used to generate the content of the app within the web page.
     * @constructor
     */
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
}

new App().Generate();