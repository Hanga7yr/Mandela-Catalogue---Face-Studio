import { CanvasDrawingHelper } from "/js/app/CanvasDrawingHelper.js";
import { CanvasPatternHelper } from "/js/app/CanvasPatternHelper.js";
import { CanvasUVHelper } from "/js/app/CanvasUVHelper.js";

export class CanvasHelper {

    /**
     * Used when generating layers to mark the amount of layers made.
     * @type {Number}
     */
    currentLayerCount;

    /**
     * An array containing all the context for the canvas layers.
     * @type {CanvasRenderingContext2D[]}
     */
    layers;

    /**
     * The container where all the layers are stored.
     * @type {HTMLElement}
     */
    parentElement;

    /**
     * Stores the current state of the events.
     * @type {number[]}
     */
    eventState;

    /**
     * Stores the timeoutID for checking if the mouse has been moved.
     * @type {number}
     */
    mouseMovingTimeout;
    /**
     * Stores the delay in milliseconds for the mouseMovingTimeout
     * @type {number}
     */
    mouseMovingTimeoutDelay;

    /**
     * Stores all helpers.
     * @type {Array<CanvasDrawingHelper>}
     */
    helpers;

    constructor() {
        this.layers = [];
        this.eventState = [];
        this.helpers = [];

        this.mouseMovingTimeoutDelay = 100;

        this.onMouseDownAndMove = [];
        this.onMouseEnter = [];
        this.onMouseLeave = [];
        this.onMouseUp = [];
        this.onMouseDown = [];
        this.onMouseMove = [];
        this.onGenerateLayers = [];
        
        const uvHelper = new CanvasUVHelper();
        this.AddOnGenerateLayersHandler(uvHelper.GenerateLayers.bind(uvHelper));

        const patternHelper = new CanvasPatternHelper();
        // this.AddOnMouseDownHandler(patternHelper.OnMouseDownHandler.bind(patternHelper));
        this.AddonMouseDownAndMoveHandler(patternHelper.OnMouseDownHandler.bind(patternHelper));
        this.AddOnMouseUpHandler(patternHelper.OnMouseUpHandler.bind(patternHelper));
        this.AddOnMouseLeaveHandler(patternHelper.OnMouseUpHandler.bind(patternHelper));
        this.AddOnGenerateLayersHandler(patternHelper.GenerateLayers.bind(patternHelper));

        const patternOutlineHelper = new CanvasPatternHelper();
        // this.AddOnMouseDownHandler(patternOutlineHelper.OnMouseDownHandler.bind(patternOutlineHelper));
        this.AddonMouseDownAndMoveHandler(patternOutlineHelper.OnMouseDownHandler.bind(patternOutlineHelper));
        this.AddOnMouseUpHandler(patternOutlineHelper.OnMouseUpHandler.bind(patternOutlineHelper));
        this.AddOnMouseLeaveHandler(patternOutlineHelper.OnMouseUpHandler.bind(patternOutlineHelper));
        this.AddOnGenerateLayersHandler(patternOutlineHelper.GenerateLayers.bind(patternOutlineHelper));

        patternOutlineHelper.isAllowedPermanent = false;
        patternOutlineHelper.drawingMode = CanvasPatternHelper.MODE_STROKE;
        patternOutlineHelper.drawingPattern = CanvasPatternHelper.PATTERN_RECT;
        patternOutlineHelper.drawingPath = CanvasPatternHelper.PATH_VERTEX;

        this.helpers[CanvasDrawingHelper.TYPE_PATTERN] = patternHelper;
        this.helpers[CanvasDrawingHelper.TYPE_IMAGE] = uvHelper;
        this.helpers[CanvasDrawingHelper.TYPE_PATTERN_OUTLINE] = patternOutlineHelper;

        this.mouseMovingTimeout = setTimeout(this.CheckMouseMoving.bind(this), this.mouseMovingTimeoutDelay);
    }


    /**
     * Set the parent element for the layers.
     * @param {HTMLElement} parentElement
     * @constructor
     */
    SetParentElement(parentElement) {
        if(parentElement) this.parentElement = parentElement;
    }

    /**
     * Calls for the generation of the canvas layers and adds the event listeners for the event layer.
     * @constructor
     */
    Generate() {
        if(this.parentElement === null) {
            console.warn("CanvasHelper#Generate: Generating without parentElement. Searching for a container with id (canvasContainer)");
            const newParentElement = document.getElementById("canvasContainer");
            if(newParentElement) {
                this.SetParentElement(newParentElement);
            } else {
                console.warn("CanvasHelper#Generate: No container found. Creating one.");
                this.parentElement = document.createElement("div");
                this.parentElement.setAttribute("id", "canvasContainer");
            }
        }

        this.parentElement.classList.add("position-relative");
        this.parentElement.classList.add("d-flex");
        this.parentElement.classList.add("justify-content-center");

        this.onGenerateLayers.forEach((eventHandler) => {
            const newLayers = eventHandler(this.currentLayerCount);
            if(newLayers){
                if(Array.isArray(newLayers))
                    newLayers.forEach((layer) => this.layers.push(layer));
                else
                    this.layers.push(newLayers);
            }
        });

        const eventLayer = CanvasHelper.GenerateLayer(this.currentLayerCount < 10 ? 10 : 1000);
        eventLayer?.canvas.addEventListener('mousemove', this.OnMouseMoveListener.bind(this));
        eventLayer?.canvas.addEventListener('mouseup', this.OnMouseUpListener.bind(this));
        eventLayer?.canvas.addEventListener('mousedown', this.OnMouseDownListener.bind(this));
        eventLayer?.canvas.addEventListener('mouseenter', this.OnMouseEnterListener.bind(this));
        eventLayer?.canvas.addEventListener('mouseleave', this.OnMouseLeaveListener.bind(this));
        this.layers.push(eventLayer);

        this.layers.forEach(layer => this.parentElement.appendChild(layer.canvas));
    }

    /**
     * EventHandlers on the state where the canvas needs to update.
     * It accepts either a list of layers to update or null, in which case it will update all.
     * @param {CanvasRenderingContext2D[]|number|null} layer The layer or layers to update. Starts at 1.
     */
    UpdateLayers(layers) {
        /** @type {CanvasRenderingContext2D[]} */
        let layersToUpdate = [];

        if(layers) {
            if(layers instanceof Number) {
                if(this.layers.length < layers) {
                    layersToUpdate.push(this.layers[layers - 1]);
                }
            } else if(layers instanceof Array) {
                if(layers.every((layer) => layer instanceof CanvasRenderingContext2D))
                    layersToUpdate = this.layers
                        .filter((layer) => layers.includes(layer));
            }
        } else layersToUpdate = this.layers;

        layersToUpdate
            .forEach((layer) => {
                layer.canvas.setAttribute("width", this.parentElement.clientWidth);
                layer.canvas.setAttribute("height", this.parentElement.clientHeight);
            })
    }

    /**
     * Generates a layer at a determined zIndex
     * @param zIndex Where in the stack should this layer be.
     * @returns {CanvasRenderingContext2D} The newly created layer.
     * @constructor
     */
    static GenerateLayer(zIndex) {
        const newCanvas = document.createElement("canvas");

        newCanvas.classList.add("position-absolute");
        newCanvas.classList.add("h-100");
        newCanvas.style.zIndex = zIndex;

        return newCanvas.getContext("2d");
    }

    /**
     * @param {number} helperID The ID of the helper.
     * @returns {CanvasDrawingHelper|CanvasPatternHelper} The drawing helper referenced.
     * @constructor
     */
    GetHelper(helperID) {
       return this.helpers[helperID];
    }

    /** Event and EventHandlers Section DONOTENTER XD */

    static MOUSE_LEAVE = 0;
    static MOUSE_ENTER = 1;
    static MOUSE_UP = 2;
    static MOUSE_DOWN = 3;
    static MOUSE_MOVE = 4;


    /**
     * Updated the state of the MouseMoving Event and stop the timeout.
     * @constructor
     */
    CheckMouseMoving() {
        if(this.eventState.includes(CanvasHelper.MOUSE_MOVE))
            this.eventState.splice(this.eventState.indexOf(CanvasHelper.MOUSE_MOVE));
        clearTimeout(this.mouseMovingTimeout);
    }

    /**
     * Calls the appropriate handlers when the onmousemove event is called on the EventLayer.
     * @param {MouseEvent} event The event data.
     * @constructor
     */
    OnMouseMoveListener(event) {
        // console.count("CanvasHelper#OnMouseMoveListener");

        if(!this.eventState.includes(CanvasHelper.MOUSE_MOVE))
            this.eventState.push(CanvasHelper.MOUSE_MOVE);
        this.mouseMovingTimeout = setTimeout(this.CheckMouseMoving.bind(this), this.mouseMovingTimeoutDelay);

        this.onMouseMove.forEach((eventHandler) => eventHandler(event, this));

        if(this.eventState.includes(CanvasHelper.MOUSE_MOVE) && this.eventState.includes(CanvasHelper.MOUSE_DOWN))
            this.onMouseDownAndMove.forEach(eventHandler => eventHandler(event, this));
    }

    /**
     * Calls the appropriate handlers when the onmouseup event is called on the EventLayer.
     * @param {MouseEvent} event The event data.
     * @constructor
     */
    OnMouseUpListener(event) {
        console.count("CanvasHelper#OnMouseUpListener");

        if(!this.eventState.includes(CanvasHelper.MOUSE_UP))
            this.eventState.push(CanvasHelper.MOUSE_UP);
        if(this.eventState.includes(CanvasHelper.MOUSE_DOWN))
            this.eventState.splice(this.eventState.indexOf(CanvasHelper.MOUSE_DOWN));

        this.onMouseUp.forEach(eventHandler => eventHandler(event, this));
    }

    /**
     * Calls the appropriate handlers when the onmousedown event is called on the EventLayer.
     * @param {MouseEvent} event The event data.
     * @constructor
     */
    OnMouseDownListener(event) {
        console.count("CanvasHelper#OnMouseDownListener");

        if(!this.eventState.includes(CanvasHelper.MOUSE_DOWN))
            this.eventState.push(CanvasHelper.MOUSE_DOWN);
        if(this.eventState.includes(CanvasHelper.MOUSE_UP))
            this.eventState.splice(this.eventState.indexOf(CanvasHelper.MOUSE_UP));

        this.onMouseDown.forEach(eventHandler => eventHandler(event, this));
    }

    /**
     * Calls the appropriate handlers when the onmouseenter event is called on the EventLayer.
     * @param {MouseEvent} event The event data.
     * @constructor
     */
    OnMouseEnterListener(event) {
        console.count("CanvasHelper#OnMouseEnterListener");

        if(!this.eventState.includes(CanvasHelper.MOUSE_ENTER))
            this.eventState.push(CanvasHelper.MOUSE_ENTER);
        if(this.eventState.includes(CanvasHelper.MOUSE_LEAVE))
            this.eventState.splice(this.eventState.indexOf(CanvasHelper.MOUSE_LEAVE));

        this.onMouseEnter.forEach(eventHandler => eventHandler(event, this));
    }

    /**
     * Calls the appropriate handlers when the onmouseleave event is called on the EventLayer.
     * @param {MouseEvent} event The event data.
     * @constructor
     */
    OnMouseLeaveListener(event) {
        console.count("CanvasHelper#OnMouseLeaveListener");

        if(!this.eventState.includes(CanvasHelper.MOUSE_LEAVE))
            this.eventState.push(CanvasHelper.MOUSE_LEAVE);
        if(this.eventState.includes(CanvasHelper.MOUSE_ENTER))
            this.eventState.splice(this.eventState.indexOf(CanvasHelper.MOUSE_ENTER));

        this.onMouseLeave.forEach(eventHandler => eventHandler(event, this));
    }


    /**
     * EventHandlers on the case the left mouse key is up.
     * @type {Array<function(Event, CanvasHelper):void>}
     */
    onMouseUp;

    /**
     * EventHandlers on the case the left mouse key is down.
     * @type {Array<function(Event, CanvasHelper):void>}
     */
    onMouseDown;

    /**
     * EventHandlers on the case the mouse has entered the canvas.
     * @type {Array<function(Event, CanvasHelper):void>}
     */
    onMouseEnter;

    /**
     * EventHandlers on the case the mouse leaves the canvas.
     * @type {Array<function(Event, CanvasHelper):void>}
     */
    onMouseLeave;

    /**
     * EventHandlers on the case the mouse is within the canvas.
     * @type {Array<function(Event, CanvasHelper):void>}
     */
    onMouseMove;

    /**
     * EventHandlers on the case the leftClick is down and moving
     * In this case, {@link CanvasHelper#onMouseMove} will be invoked regardless and {@link CanvasHelper#onMouseDown} once.
     * @type {Array<function(Event, CanvasHelper):void>}
     */
    onMouseDownAndMove;

    /**
     * EventHandlers on the state where layers are being generated.
     * @type {Array<function(number):CanvasRenderingContext2D[]|CanvasRenderingContext2D>}
     */
    onGenerateLayers;

    /**
     * Adds a handler to the onGenerateLayers.
     * @param {function(number):CanvasRenderingContext2D[]|CanvasRenderingContext2D} eventHandler
     */
    AddOnGenerateLayersHandler(eventHandler) {
        if(!this.onGenerateLayers.includes(eventHandler))
            this.onGenerateLayers.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseDownEvent.
     * @param {function(Event, CanvasHelper):void} eventHandler
     */
    AddOnMouseDownHandler(eventHandler) {
        if(!this.onMouseDown.includes(eventHandler))
            this.onMouseDown.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseUpEvent.
     * @param {function(Event, CanvasHelper):void} eventHandler
     */
    AddOnMouseUpHandler(eventHandler) {
        if(!this.onMouseUp.includes(eventHandler))
            this.onMouseUp.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseMoveEvent.
     * @param {function(Event, CanvasHelper):void} eventHandler
     */
    AddOnMouseMoveHandler(eventHandler) {
        if(!this.onMouseMove.includes(eventHandler))
            this.onMouseMove.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseEnterEvent.
     * @param {function(Event, CanvasHelper):void} eventHandler
     */
    AddOnMouseEnterHandler(eventHandler) {
        if(!this.onMouseEnter.includes(eventHandler))
            this.onMouseEnter.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseLeaveEvent.
     * @param {function(Event, CanvasHelper):void} eventHandler
     */
    AddOnMouseLeaveHandler(eventHandler) {
        if(!this.onMouseLeave.includes(eventHandler))
            this.onMouseLeave.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseDownAndMoveEvent.
     * @param {function(Event, CanvasHelper):void} eventHandler
     */
    AddonMouseDownAndMoveHandler(eventHandler) {
        if(!this.onMouseDownAndMove.includes(eventHandler))
            this.onMouseDownAndMove.push(eventHandler);
    }
}