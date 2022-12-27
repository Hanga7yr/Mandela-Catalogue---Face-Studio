import { UIHelper } from '/js/UI/UIHelper.js';

export class CanvasHelper {
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
    /** @type {({event: string, handlers: (function(Event):void)[]})[]} */
    eventMap = [];

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
     * Generates the components necessary for the proper function of the utility.
     * The layers to append must be returned.
     * Requires children to implement it.
     * @param {number} currentLayer Number of the current layer within the canvasContainer
     * @returns {HTMLElement|CanvasRenderingContext2D|CanvasRenderingContext2D[]}
     * @constructor
     */
    Generate(currentLayer) { }
    /**
     * Generates a layer at a determined zIndex
     * @param zIndex Where in the stack should this layer be.
     * @returns {CanvasRenderingContext2D} The newly created layer.
     * @constructor
     */
    static GenerateLayer(zIndex) {
        return (HTMLCanvasElement) (UIHelper.CreateOrUpdateElement({
            tag: "canvas",
            class: ["position-absolute", "h-100"],
            style: [{ property: "zIndex", value: zIndex }]
        })).getContext("2d");
    }

    /**
     * Get the relative position of the canvas based on the position of the canvas and a position.
     * @param {number} clientX The X position to get.
     * @param {number} clientY The Y position to get.
     * @param {number} canvasX The X position of a canvas.
     * @param {number} canvasY The Y position of a canvas.
     * @returns {{x: number, y: number}}
     * @constructor
     */
    ObtainActualPosition(clientX, clientY, canvasX, canvasY) {
        const x = clientX - canvasX;
        const y = clientY - canvasY;

        return {x: x, y: y};
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
                CanvasHelper.STATE_NEED_MORE_POS :
                this.isInteractive ? CanvasHelper.STATE_AWAIT_DRAW : CanvasHelper.STATE_NEED_END_POS;
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
                CanvasHelper.STATE_NEED_MORE_POS :
                CanvasHelper.STATE_NEED_END_POS;
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

            this.drawingState = CanvasHelper.STATE_AWAIT_DRAW;
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
            case CanvasHelper.STATE_NONE:
            case CanvasHelper.STATE_NEED_START_POS:
                this.AssignStartPoint(point);
                break;
            case CanvasHelper.STATE_NEED_MORE_POS:
                this.AssignMorePoints(point);
                break;
            case CanvasHelper.STATE_NEED_END_POS:
                this.AssignEndPoint(point);
                break;
            default:
                break;
        }
    }


    /**
     * Creates an index for a determined event.
     * @param {string} eventID The string identifier of the event.
     * @param {(function(Event):void)[]|null} handlers The handlers of the event
     * @constructor
     */
    CreateEvent(eventID, handlers= null) {
        if(eventID) {
            if(!this.eventMap.some(({event, handlers}) => event === eventID)) {
                console.debug(`Event: ${eventID} doesn't exists. Creating`);
                this.eventMap.push({ event: eventID, handlers: handlers ?? [] });
            } else console.debug(`Cannot create Event: ${eventID}. Already exists.`);
        } else console.debug(`EventID cannot be null`);
    }

    /**
     * Add an event handler to the determined event.
     * @param {string} event The string identifier of the event.
     * @param {function(Event):void} handler The handler of the event.
     * @constructor
     */
    AddEventHandler(event, handler) {
        if(!event) console.log("Event cannot be null.");
        if(!handler) console.log("Handler cannot be null.");

        console.debug(`Attempting to add event handler to: ${event}.`, handler);
        if(this.eventMap.some(({eventID, handlers}) => eventID === event)) {
            this.eventMap.filter(({eventID, handlers}) => eventID === event)[0].handlers.push(handler);
        } else this.CreateEvent(event, [handler]);
    }

    /**
     * Triggers the call of the eventHandler for a specific event
     * @param {string} eventID The string identifier of the event.
     * @param {Event} event List of arguments to pass to the handler
     * @constructor
     */
    TriggerEvent(eventID, event) {
        if(!eventID) console.log("Event cannot be null.");

        console.debug(`Attempting to trigger event: ${eventID}.`);
        if(this.eventMap.some(({eventID, handlers}) => eventID === event)) {
            this.eventMap.filter(({eventID, handlers}) => eventID === event)[0].handlers.forEach((handler) => handler(event));
        } else console.debug(`No Event Handlers for: ${eventID}`);
    }

    /**
     * Handles the interception and dispatch of event.
     * @param {Event} event
     * @constructor
     */
    HandleEvent(event) {
        console.debug(`Interception of event: ${event}.`);
        this.TriggerEvent(event.type, event);
    }

    static STATE_NONE = 0;
    static STATE_NEED_START_POS = 1;
    static STATE_NEED_MORE_POS = 2;
    static STATE_NEED_END_POS = 3;
    static STATE_AWAIT_DRAW = 4;
}