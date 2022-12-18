import { CanvasDrawingHelper } from "/js/app/CanvasDrawingHelper.js";

export class CanvasPatternHelper extends CanvasDrawingHelper {
    fillStyle = "rgb(0, 0, 0)";
    strokeStyle = "rgb(0, 0, 0)";

    /**
     * Image to draw on image pattern.
     * @type {ImageBitmap}
     */
    image = null;

    drawingMode = CanvasPatternHelper.MODE_NONE;
    drawingPath = CanvasPatternHelper.MODE_NONE;
    drawingPattern = CanvasPatternHelper.PATTERN_NONE;

    onDrawingSide = false;

    /** @type {Path2D[]} */
    drawingSidePath;

    constructor() {
        super();

        this.onChangePattern = [];
        this.onChangeMode = [];
        this.onChangePath = [];

        this.drawingSidePath = [];

        this.AddOnDrawEventHandler(this.DrawCallback.bind(this));
        this.AddOnDrawingEventHandler(this.DrawingCallback.bind(this));
    }

    /**
     * How to react to drawing callbacks
     * @param {CanvasDrawingHelper} canvasDrawing
     * @constructor
     */
    DrawingCallback(canvasDrawing) {
        if(canvasDrawing.isInteractive) {
            this.Draw(canvasDrawing.buffer);
        }
    }
    /**
     * How to react to drawing callbacks
     * @param {CanvasDrawingHelper} canvasDrawing
     * @constructor
     */
    DrawCallback(canvasDrawing) {
        if(canvasDrawing.isAllowedPermanent) this.Draw(canvasDrawing.target);
    }

    Draw(layer) {
        const startPos = this.startingPoint;
        const endPos = this.isInteractive ? this.currentPoint : this.endPoint;
        let deltaPos = [endPos.x-startPos.x, endPos.y-startPos.y];
        const radius = Math.sqrt(Math.pow(deltaPos[0], 2) + Math.pow(deltaPos[1], 2));
        const xCenter = startPos.x + deltaPos[0]*0.5;
        const yCenter = startPos.y + deltaPos[1]*0.5;

        layer.fillStyle = this.fillStyle;
        layer.strokeStyle = this.strokeStyle;

        const currentPath = new Path2D();
        switch (this.drawingPattern) {
            case CanvasPatternHelper.PATTERN_RECT:
                switch (this.drawingPath) {
                    case CanvasPatternHelper.PATH_VERTEX:
                        currentPath.rect(
                            startPos.x, startPos.y,
                            deltaPos[0], deltaPos[1]
                        );
                        break;
                    case CanvasPatternHelper.PATH_RADIUS:
                        const xCenter = startPos.x - (deltaPos[0]);
                        const yCenter = startPos.y - (deltaPos[1]);

                        const xEnd = deltaPos[0]*2;
                        const yEnd = deltaPos[1]*2;

                        currentPath.rect(
                            xCenter, yCenter,
                            xEnd, yEnd,
                        );
                        break;
                    default:
                        break;
                }
                break;
            case CanvasPatternHelper.PATTERN_CIRCLE:
                switch (this.drawingPath) {
                    case CanvasPatternHelper.PATH_VERTEX:
                        currentPath.arc(
                            xCenter, yCenter, Math.min(Math.abs(deltaPos[0]), Math.abs(deltaPos[1]))*0.5,
                            0, 2 * Math.PI
                        );
                        break;
                    case CanvasPatternHelper.PATH_RADIUS:
                        currentPath.arc(
                            startPos.x, startPos.y, radius,
                            0, 2 * Math.PI
                        );
                        break;
                    case CanvasPatternHelper.PATH_DIA:
                        const radiusDia = Math.sqrt(
                            Math.pow((deltaPos[0]*0.5), 2) + Math.pow((deltaPos[1]*0.5), 2)
                        );

                        currentPath.arc(
                            xCenter, yCenter, radiusDia,
                            0, 2 * Math.PI
                        );
                        break;
                    default:
                        break;
                }
                break;
            case CanvasPatternHelper.PATTERN_ELLIPSE:
                switch (this.drawingPath) {
                    case CanvasPatternHelper.PATH_VERTEX:
                        currentPath.ellipse(
                            xCenter, yCenter,
                            Math.abs(deltaPos[0]/2), Math.abs(deltaPos[1]/2),
                            Math.PI * 2,
                            0,
                            Math.PI * 2
                        )
                        break;
                    default:
                        break;
                }
                break;
            case CanvasPatternHelper.PATTERN_IMAGE:
                switch (this.drawingPath) {
                    default:
                    case CanvasPatternHelper.MODE_NONE:
                        layer.drawImage(
                            this.image,
                            startPos.x, startPos.y,
                            deltaPos[0], deltaPos[1]
                        );
                        break;
                }
                break;
            case CanvasPatternHelper.PATTERN_NONE:
            default:
                break;
        }
        currentPath.closePath();
        if(this.onDrawingSide) this.drawingSidePath.push(currentPath);

        switch (this.drawingMode) {
            case CanvasPatternHelper.MODE_FILL:
                layer.fill(currentPath);
                break;
            case CanvasPatternHelper.MODE_STROKE:
                layer.stroke(currentPath);
                break;
            case CanvasPatternHelper.MODE_NONE:
            default:
                break;
        }
    }

    DrawImageAsBackground() {
        this.target.drawImage(
            this.image,
            0, 0,
            this.target.canvas.width, this.target.canvas.height
        );
    }


    ChangePattern(pattern) {
        this.drawingPattern = pattern;

        this.onChangePattern
            .forEach(handler => handler(pattern, this.GetAvailableMode(pattern), this.GetAvailablePath(pattern)));
    }
    ChangeMode(mode) {
        this.drawingMode = mode;

        this.onChangeMode
            .forEach(handler => handler(mode));
    }
    ChangePath(path) {
        this.drawingPath = path;

        this.onChangePath
            .forEach(handler => handler(path));
    }

    GetAvailableMode(pattern) {
        const available = [];
        switch (pattern) {
            case CanvasPatternHelper.PATTERN_CIRCLE:
            case CanvasPatternHelper.PATTERN_RECT:
            case CanvasPatternHelper.PATTERN_ELLIPSE:
                available.push(CanvasPatternHelper.MODE_STROKE);
            case CanvasPatternHelper.PATTERN_IMAGE:
                available.push(CanvasPatternHelper.MODE_FILL);
            default:
                available.push(CanvasPatternHelper.MODE_NONE);
                break;
        }
        return available;
    }

    GetAvailablePath(pattern) {
        const available = [];
        switch (pattern) {
            case CanvasPatternHelper.PATTERN_CIRCLE:
                available.push(CanvasPatternHelper.PATH_DIA);
            case CanvasPatternHelper.PATTERN_RECT:
                available.push(CanvasPatternHelper.PATH_RADIUS);
            case CanvasPatternHelper.PATTERN_ELLIPSE:
                available.push(CanvasPatternHelper.PATH_VERTEX);
            case CanvasPatternHelper.PATTERN_IMAGE:
            default:
                available.push(CanvasPatternHelper.PATH_NONE);
                break;
        }
        return available;
    }

    OnSideChange(side) {
        this.drawingSidePath = [];
        this.onDrawingSide = true;
    }


    /**
     * EventHandlers on the case the utility should change pattern.
     * @type {Array<function(Event):void>}
     */
    onChangePattern;
    /**
     * Adds a handler to the Change Pattern event.
     * @param {function(Event):void} eventHandler
     */
    AddOnChangePatternEventHandler(eventHandler) {
        if(!this.onChangePattern.includes(eventHandler))
            this.onChangePattern.push(eventHandler);
    }

    /**
     * EventHandlers on the case the utility should change path.
     * @type {Array<function(Event):void>}
     */
    onChangePath;
    /**
     * Adds a handler to the Change Path event.
     * @param {function(Event):void} eventHandler
     */
    AddOnChangePathEventHandler(eventHandler) {
        if(!this.onChangePath.includes(eventHandler))
            this.onChangePath.push(eventHandler);
    }

    /**
     * EventHandlers on the case the utility should change mode.
     * @type {Array<function(Event):void>}
     */
    onChangeMode;
    /**
     * Adds a handler to the Change Mode event.
     * @param {function(Event):void} eventHandler
     */
    AddOnChangeModeEventHandler(eventHandler) {
        if(!this.onChangeMode.includes(eventHandler))
            this.onChangeMode.push(eventHandler);
    }

    static PATTERN = 1;
    static MODE = 2;
    static PATH = 3;

    static PATTERN_NONE = 0;
    static PATTERN_RECT = 1;
    static PATTERN_CIRCLE = 2;
    static PATTERN_ELLIPSE = 3;
    static PATTERN_IMAGE = 4;

    static PATTERNS = [
        CanvasPatternHelper.PATTERN_NONE,
        CanvasPatternHelper.PATTERN_RECT,
        CanvasPatternHelper.PATTERN_CIRCLE,
        CanvasPatternHelper.PATTERN_ELLIPSE,
        CanvasPatternHelper.PATTERN_IMAGE
    ];

    static MODE_NONE = 0;
    static MODE_FILL = 1;
    static MODE_STROKE = 2;
    static MODES = [
        CanvasPatternHelper.MODE_NONE,
        CanvasPatternHelper.MODE_FILL,
        CanvasPatternHelper.MODE_STROKE
    ];
    static PATH_NONE = 0;
    static PATH_VERTEX = 1;
    static PATH_RADIUS = 2;
    static PATH_DIA = 3;
    static PATHS = [
        CanvasPatternHelper.PATH_NONE,
        CanvasPatternHelper.PATH_VERTEX,
        CanvasPatternHelper.PATH_RADIUS,
        CanvasPatternHelper.PATH_DIA
    ];
}