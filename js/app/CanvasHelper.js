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
    layers = [];

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

    Generate() {

        this.onGenerateLayers.forEach((eventHandler) => {
            const newLayer = eventHandler(this.currentLayerCount);
            if(newLayer) this.layers.push(newLayer);
        });

        this.layers.forEach((layer) => {
            layer?.addEventListener('mousemove', this.OnMouseMove.bind(this));
            layer?.addEventListener('mouseup', this.OnMouseUp.bind(this));
            layer?.addEventListener('mousedown', this.OnMouseDown.bind(this));
            layer?.addEventListener('mouseenter', this.OnMouseEnter.bind(this));
            layer?.addEventListener('mouseleave', this.OnMouseLeave.bind(this));
        });
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
        }

        layersToUpdate
            .forEach((layer) => {
                layer.canvas.setAttribute("width", this.parentElement.clientWidth.toString());
                layer.canvas.setAttribute("height", this.parentElement.clientHeight.toString());
            })
    }


    /** Event and EventHandlers Section DONOTENTER XD */

    static MOUSE_LEAVE = 0;
    static MOUSE_ENTER = 1;
    static MOUSE_UP = 2;
    static MOUSE_DOWN = 3;
    static MOUSE_MOVE = 4;

    CheckMouseMoving() {
        this.mouseMoving = false;
        clearTimeout(this.mouseMovingTimeout);
    }
    OnMouseMove(event) {
        console.log("Mouse Move: " + event);
        this.mouseMoving = true;
        this.mouseMovingTimeout = setTimeout(this.CheckMouseMoving, 100);

        if(this.mouseDown && this.mouseEnter) {
            this?.onMouseDownAndMove?.forEach((handler) => handler?.call(this, event, this));
        }
    }

    OnMouseUp(event) {
        console.log("Mouse Up: " + event);
        this.mouseUp = true;
        this.mouseDown = false;

        this?.onMouseUpHandlers.forEach((handler) => handler?.call(this, event, this));
    }
    OnMouseDown(event) {
        console.log("Mouse Down: " + event);
        this.mouseDown = true;
        this.mouseUp = false;
    }
    OnMouseEnter(event) {
        console.log("Mouse Enter: " + event);
        this.mouseEnter = true;
        this.mouseLeave = false;
    }

    /**
     * Calls the apropiate handlers when the onmouseleave event is called on the EventLayer.
     * @param {MouseEvent} event The event data.
     * @constructor
     */
    OnMouseLeaveListener(event) {
        console.count("CanvasHelper#OnMouseLeaveListener");

        this.mouseLeave = true;
        this.mouseEnter = false;

        if(this.eventState.includes(CanvasHelper.MOUSE_LEAVE))
            this.eventState.push(CanvasHelper.MOUSE_LEAVE);
        if(this.eventState.includes(CanvasHelper.MOUSE_ENTER))
            this.eventState.splice(this.eventState.indexOf(CanvasHelper.MOUSE_LEAVE));

        this.OnMouseUp(event);
        this.onMouseLeave.forEach(eventHandler => eventHandler(event));
    }


    /**
     * EventHandlers on the case the left mouse key is up.
     * @type {Array<function(Event):void>}
     */
    onMouseUp;

    /**
     * EventHandlers on the case the left mouse key is down.
     * @type {Array<function(Event):void>}
     */
    onMouseDown;

    /**
     * EventHandlers on the case the mouse has entered the canvas.
     * @type {Array<function(Event):void>}
     */
    onMouseEnter;

    /**
     * EventHandlers on the case the mouse leaves the canvas.
     * @type {Array<function(Event):void>}
     */
    onMouseLeave;

    /**
     * EventHandlers on the case the mouse is within the canvas.
     * @type {Array<function(Event):void>}
     */
    onMouseMove;

    /**
     * EventHandlers on the case the leftClick is down and moving
     * In this case, {@link CanvasHelper#onMouseMove} will be invoked regardless and {@link CanvasHelper#onMouseDown} once.
     * @type {Array<function(Event):void>}
     */
    onMouseDownAndMove;

    /**
     * EventHandlers on the state where layers are being generated.
     * @type {Array<function(number):CanvasRenderingContext2D>}
     */
    onGenerateLayers;

    /**
     * Adds a handler to the onGenerateLayers.
     * @param {function(number):void} eventHandler
     */
    AddOnGenerateLayersHandler(eventHandler) {
        if(!this.onGenerateLayers.includes(eventHandler))
            this.onGenerateLayers.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseDownEvent.
     * @param {function(Event):void} eventHandler
     */
    AddOnMouseDownHandler(eventHandler) {
        if(!this.onMouseDown.includes(eventHandler))
            this.onMouseDown.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseUpEvent.
     * @param {function(Event):void} eventHandler
     */
    AddOnMouseUpHandler(eventHandler) {
        if(!this.onMouseUp.includes(eventHandler))
            this.onMouseUp.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseMoveEvent.
     * @param {function(Event):void} eventHandler
     */
    AddOnMouseMoveHandler(eventHandler) {
        if(!this.onMouseMove.includes(eventHandler))
            this.onMouseMove.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseEnterEvent.
     * @param {function(Event):void} eventHandler
     */
    AddOnMouseEnterHandler(eventHandler) {
        if(!this.onMouseEnter.includes(eventHandler))
            this.onMouseEnter.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseLeaveEvent.
     * @param {function(Event):void} eventHandler
     */
    AddOnMouseLeaveHandler(eventHandler) {
        if(!this.onMouseLeave.includes(eventHandler))
            this.onMouseLeave.push(eventHandler);
    }

    /**
     * Adds a handler to the onMouseDownAndMoveEvent.
     * @param {function(Event):void} eventHandler
     */
    AddonMouseDownAndMoveHandler(eventHandler) {
        if(!this.onMouseDownAndMove.includes(eventHandler))
            this.onMouseDownAndMove.push(eventHandler);
    }
}