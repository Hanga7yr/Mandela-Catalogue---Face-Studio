import { CanvasHelper } from "/js/app/CanvasHelper.js";

export class CanvasDrawingHelper {

    /**
     * Stores an object containing the relative position of the starting point.
     * @type {{x: Number, y: Number}}
     */
    startingPoint;
    /**
     * Stores an array containing the relative position of the several points.
     * @type {Array<{x: Number, y: Number}>}
     */
    intermediatePoints;
    /**
     * Stores an object containing the relative position of the end point.
     * @type {{x: Number, y: Number}}
     */
    endPoint;
    /**
     * Stores an object containing the relative position of the current point.
     * @type {{x: Number, y: Number}}
     */
    currentPoint;

    /**
     * The layer where changes can be applied.
     * This layer will be erased over the drawing process.
     * @type {CanvasRenderingContext2D}
     */
    buffer;
    /**
     * The layer where changes must be committed to persist.
     * This layer cannot be erased over drawing process.
     * @type {CanvasRenderingContext2D}
     */
    target;

    /**
     * Stores the current state of the drawing helper.
     * @type {number}
     */
    drawingState;

    /**
     * Marks if it should draw into target.
     * @type {boolean}
     */
    isAllowedPermanent = true;
    /**
     * Marks if it should draw into buffer to show the current state.
     * @type {boolean}
     */
    isInteractive = true;

    /**
     * Marks if it should draw.
     * @type {boolean}
     */
    shouldDraw = true;

    /**
     * Marks if it should require multiple point to draw.
     * @type {boolean}
     */
    requireMultiplePoints = false;

    constructor() {
        this.startingPoint = {x: 0, y: 0};
        this.intermediatePoints = [];
        this.endPoint = {x: 0, y: 0};
        this.currentPoint = {x: 0, y: 0};

        this.onDrawing = [];
        this.onDraw = [];

        this.drawingState = CanvasDrawingHelper.STATE_NONE;
    }

    /**
     * Generates the layers needed to operate.
     * @param {number} layer
     * @returns {CanvasRenderingContext2D[]|CanvasRenderingContext2D}
     * @constructor
     */
    GenerateLayers(layer) {
        this.target = CanvasHelper.GenerateLayer(layer++);
        this.buffer = CanvasHelper.GenerateLayer(layer++);

        return [this.target, this.buffer];
    }

    /**
     * The handler for the mousedown event.
     * @param {MouseEvent} event The event of mouse down.
     * @param {CanvasHelper} canvasHelper The canvasHelper from where the event originates.
     * @constructor
     */
    OnMouseDownHandler(event, canvasHelper) {
        const point = this.GetActualPosition(event.clientX, event.clientY);

        this.AssignPoint(point);

        if(this.isInteractive) this.ClearLayer();
        if(this.isInteractive && this.shouldDraw)
            this.onDrawing.forEach(handler => handler(this));
    }

    /**
     * The handler for the mouseup event.
     * @param {MouseEvent} event The event of mouse ip.
     * @param {CanvasHelper} canvasHelper The canvasHelper from where the event originates.
     * @constructor
     */
    OnMouseUpHandler(event, canvasHelper) {
        const point = this.GetActualPosition(event.clientX, event.clientY);

        this.AssignPoint(point);

        if(this.isAllowedPermanent && this.shouldDraw)
            this.onDraw.forEach(handler => handler(this));

        this.ClearLayer();
        this.Reset();
    }


    /**
     * Set the starting point.
     * @param {{x: number, y: number}} point The point to assign.
     * @constructor
     */
    AssignStartPoint(point) {
        if(point) {
            this.startingPoint = point;

            this.drawingState = this.requireMultiplePoints ?
                CanvasDrawingHelper.STATE_NEED_MORE_POS :
                this.isInteractive ? CanvasDrawingHelper.STATE_AWAIT_DRAW : CanvasDrawingHelper.STATE_NEED_END_POS;
        }
    }
    /**
     * Set the current point.
     * @param {{x: number, y: number}} point The point to assign.
     * @constructor
     */
    AssignCurrentPoint(point) {
        if(point) {
            this.currentPoint = point;
        }
    }
    /**
     * Adds a points to the path.
     * @param {{x: number, y: number}} point The point to assign.
     * @constructor
     */
    AssignMorePoints(point) {
        if(point) {
            this.intermediatePoints.push(point);

            this.drawingState = this.intermediatePoints.length < 10 ?
                CanvasDrawingHelper.STATE_NEED_MORE_POS :
                CanvasDrawingHelper.STATE_NEED_END_POS;
        }
    }
    /**
     * Set the end point.
     * @param {{x: number, y: number}} point The point to assign.
     * @constructor
     */
    AssignEndPoint(point) {
        if(point) {
            this.endPoint = point;

            this.drawingState = CanvasDrawingHelper.STATE_AWAIT_DRAW;
        }
    }

    /**
     * Assigns a point depending on the state of the utility.
     * @param {{x: number, y: number}} point The point to assign.
     * @constructor
     */
    AssignPoint(point) {
        this.AssignCurrentPoint(point);

        switch (this.drawingState) {
            case CanvasDrawingHelper.STATE_NONE:
            case CanvasDrawingHelper.STATE_NEED_START_POS:
                this.AssignStartPoint(point);
                break;
            case CanvasDrawingHelper.STATE_NEED_MORE_POS:
                this.AssignMorePoints(point);
                break;
            case CanvasDrawingHelper.STATE_NEED_END_POS:
                this.AssignEndPoint(point);
                break;
            default:
                break;
        }
    }

    /**
     * Clear a layer.
     * @param {CanvasRenderingContext2D} layer The layer to clearn.
     * @constructor
     */
    ClearLayer(layer = this.buffer) {
        layer.clearRect(0, 0, layer.canvas.clientWidth, layer.canvas.clientHeight);
    }

    /**
     * Reset the state of the utility
     * @constructor
     */
    Reset() {
        this.startingPoint = this.endPoint = this.currentPoint = {x: 0, y: 0};
        this.intermediatePoints = [];
        this.drawingState = CanvasDrawingHelper.STATE_NONE;
    }

    /** Helper Functions Section */

    /**
     * Get the relative position of the canvas based on the position of the canvas and a position.
     * @param {number} clientX The X position to get.
     * @param {number} clientY The Y position to get.
     * @param {number} canvasX The X position of a canvas.
     * @param {number} canvasY The Y position of a canvas.
     * @returns {{x: number, y: number}}
     * @constructor
     */
    GetActualPosition(clientX, clientY, canvasX = this.target.canvas.getBoundingClientRect().x, canvasY = this.target.canvas.getBoundingClientRect().y) {
        const x = clientX - canvasX;
        const y = clientY - canvasY;

        return {x: x, y: y};
    }

    /**
     * Sets the target layer for the drawing.
     * @param {CanvasRenderingContext2D} layer The layer to set as the target.
     * @constructor
     */
    SetActiveLayer(layer) {
        if(layer) this.target = layer;
    }

    /**
     * Sets the buffer layer for the drawing.
     * @param {CanvasRenderingContext2D} layer The layer to set as the buffer.
     * @constructor
     */
    SetBufferLayer(layer) {
        if(layer) this.buffer = layer;
    }

    /** Event and EventHandlers Section DONOTENTER XD */

    /**
     * EventHandlers on the case the utility should draw temporally.
     * @type {Array<function(CanvasDrawingHelper):void>}
     */
    onDrawing;
    /**
     * Adds a handler to the drawing event.
     * @param {function(CanvasDrawingHelper):void} eventHandler
     */
    AddOnDrawingEventHandler(eventHandler) {
        if(!this.onDrawing.includes(eventHandler))
            this.onDrawing.push(eventHandler);
    }

    /**
     * EventHandlers on the case the utility should draw.
     * @type {Array<function(CanvasDrawingHelper):void>}
     */
    onDraw;
    /**
     * Adds a handler to the Draw event.
     * @param {function(CanvasDrawingHelper):void} eventHandler
     */
    AddOnDrawEventHandler(eventHandler) {
        if(!this.onDraw.includes(eventHandler))
            this.onDraw.push(eventHandler);
    }

    static STATE_NONE = 0;
    static STATE_NEED_START_POS = 1;
    static STATE_NEED_MORE_POS = 2;
    static STATE_NEED_END_POS = 3;
    static STATE_AWAIT_DRAW = 4;

    static TYPE_PATTERN = 1;
    static TYPE_PATTERN_OUTLINE = 2;
    static TYPE_IMAGE = 3;
}