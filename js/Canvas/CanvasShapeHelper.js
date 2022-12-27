import { CanvasHelper } from '/js/Canvas/CanvasHelper.js';

export class CanvasShapeHelper extends CanvasHelper {

    currentPattern;
    currentPath;
    currentMode;

    /** @type {CanvasRenderingContext2D} */
    buffer;
    /** @type {CanvasRenderingContext2D} */
    target;

    constructor() {
        super();

        this.startingPoint = {x: 0, y: 0};
        this.intermediatePoints = [];
        this.endPoint = {x: 0, y: 0};
        this.currentPoint = {x: 0, y: 0};

        this.currentPattern = CanvasShapeHelper.PATTERN_NONE;
        this.currentPath = CanvasShapeHelper.PATH_NONE;
        this.currentMode = CanvasShapeHelper.MODE_NONE;

        this.CreateEvent(CanvasShapeHelper.PATTERN_CHANGE);
        this.CreateEvent(CanvasShapeHelper.MODE_CHANGE);
        this.CreateEvent(CanvasShapeHelper.PATH_CHANGE);
        this.CreateEvent(CanvasShapeHelper.DRAW);
        this.CreateEvent(CanvasShapeHelper.DRAWING);
    }

    Generate(currentLayer) {
        this.buffer = CanvasHelper.GenerateLayer(currentLayer++);
        this.target = CanvasHelper.GenerateLayer(currentLayer++);
        return [this.buffer, this.target];
    }

    /**
     * Adds to the path a circle depending on the options.
     * @param {Path2D}                  drawingPath The path to modify.
     * @param {string}                  path The drawing flag of path.
     * @param {object}                  info Data necessary to draw, precalculated.
     * @param {object}                  info.pos Data related to the position.
     * @param {{x: number, y: number}}  info.pos.start Data related to the starting position.
     * @param {{x: number, y: number}}  info.pos.end Data related to the end position.
     * @param {{x: number, y: number}}  info.pos.delta Data related to the difference between positions.
     * @param {{x: number, y: number}}  info.center.pos Data related to the center of the selection.
     * @param {{x: number, y: number}}  info.center.start Data related to the starting position with the center as starting.
     * @param {{x: number, y: number}}  info.center.end Data related to the end position with the center as starting.
     * @param {number}                  info.radius Data related to the length from starting to end position.
     * @param {number}                  info.side.short Data related to the shortest distance to a side.
     * @constructor
     */
    DrawCircle(drawingPath, path, info) {
        console.debug(`Attempting to draw Circle with: ${path} and ${info}`);
        switch (path) {
            case CanvasShapeHelper.PATH_VERTEX:
                drawingPath.arc(
                    info.center.pos.x, info.center.pos.y, info.side.short * 0.5,
                    0, 2 * Math.PI
                );
                break;
            case CanvasShapeHelper.PATH_RADIUS:
                drawingPath.arc(
                    info.pos.start.x, info.pos.start.y, info.radius,
                    0, 2 * Math.PI
                );
                break;
            case CanvasShapeHelper.PATH_DIA:
                drawingPath.arc(
                    info.center.pos.x, info.center.pos.y, info.radius * 0.5,
                    0, 2 * Math.PI
                );
                break;
            default:
                break;
        }
    }

    /**
     * Adds to the path a rect depending on the options.
     * @param {Path2D}                  drawingPath The path to modify.
     * @param {string}                  path The drawing flag of path.
     * @param {object}                  info Data necessary to draw, precalculated.
     * @param {object}                  info.pos Data related to the position.
     * @param {{x: number, y: number}}  info.pos.start Data related to the starting position.
     * @param {{x: number, y: number}}  info.pos.end Data related to the end position.
     * @param {{x: number, y: number}}  info.pos.delta Data related to the difference between positions.
     * @param {{x: number, y: number}}  info.center.pos Data related to the center of the selection.
     * @param {{x: number, y: number}}  info.center.start Data related to the starting position with the center as starting. Used for Rect with radius
     * @param {{x: number, y: number}}  info.center.end Data related to the end position with the center as starting. Used for Rect with radius
     * @param {number}                  info.radius Data related to the length from starting to end position.
     * @param {number}                  info.side.short Data related to the shortest distance to a side.
     * @constructor
     */
    DrawRect(drawingPath, path, info) {
        console.debug(`Attempting to draw Rect with: ${path} and ${info}`);
        switch (path) {
            case CanvasShapeHelper.PATH_VERTEX:
                drawingPath.rect(
                    info.pos.start.x, info.pos.start.y,
                    info.pos.delta.x, info.pos.delta.y
                );
                break;
            case CanvasShapeHelper.PATH_RADIUS:
                drawingPath.rect(
                    info.center.start.x, info.center.start.y,
                    info.center.end.x, info.center.end.y,
                );
                break;
            default:
                break;
        }
    }

    /**
     * Adds to the path a circle depending on the options.
     * @param {Path2D}                  drawingPath The path to modify.
     * @param {string}                  path The drawing flag of path.
     * @param {object}                  info Data necessary to draw, precalculated.
     * @param {object}                  info.pos Data related to the position.
     * @param {{x: number, y: number}}  info.pos.start Data related to the starting position.
     * @param {{x: number, y: number}}  info.pos.end Data related to the end position.
     * @param {{x: number, y: number}}  info.pos.delta Data related to the difference between positions.
     * @param {{x: number, y: number}}  info.center.pos Data related to the center of the selection.
     * @param {{x: number, y: number}}  info.center.start Data related to the starting position with the center as starting.
     * @param {{x: number, y: number}}  info.center.end Data related to the end position with the center as starting.
     * @param {number}                  info.radius Data related to the length from starting to end position.
     * @param {number}                  info.side.short Data related to the shortest distance to a side.
     * @constructor
     */
    DrawEllipse(drawingPath, path, info) {
        console.debug(`Attempting to draw Ellipse with: ${path} and ${info}`);
        switch (path) {
            case CanvasShapeHelper.PATH_VERTEX:
                drawingPath.ellipse(
                    info.center.pos.x, info.center.pos.y,
                    Math.abs(info.pos.delta.x / 2), Math.abs(info.pos.delta.y / 2),
                    Math.PI * 2,
                    0,
                    Math.PI * 2
                )
                break;
            default:
                break;
        }
    }

    /**
     * Draw into the layer with the determined configuration.
     * @param {CanvasRenderingContext2D}        layer
     * @param {string}                          pattern The pattern to draw.
     * @param {Path2D}                          drawingPath Where to store the path to draw.
     * @param {string}                          path The path to draw the pattern.
     * @param {string}                          mode The mode to draw the pattern.
     * @param {object}                          pos The mode to draw the pattern.
     * @param {{x: number, y: number}}          pos.start The mode to draw the pattern.
     * @param {{x: number, y: number}}          pos.end The mode to draw the pattern.
     * @constructor
     */
    Draw(layer, drawingPath, pattern, path, mode, pos) {
        console.debug(`Attempting to draw. Preparing drawing info.`);
        /**
         *
         * @property {object}                  pos Data related to the position.
         * @property {{x: number, y: number}}  pos.start Data related to the starting position.
         * @property {{x: number, y: number}}  pos.end Data related to the end position.
         * @property {{x: number, y: number}}  pos.delta Data related to the difference between positions.
         * @property {{x: number, y: number}}  center.pos Data related to the center of the selection.
         * @property {{x: number, y: number}}  center.start Data related to the starting position with the center as starting.
         * @property {{x: number, y: number}}  center.end Data related to the end position with the center as starting.
         * @property {number}                  radius Data related to the length from starting to end position.
         * @property {number}                  side.short Data related to the shortest distance to a side.
         */
        const info = {};
        info.pos = {};
        info.side = {};
        info.center = {};
        info.pos.start = pos.start;
        info.pos.end = pos.end;
        info.pos.delta =    { x: info.pos.end.x     - info.pos.start.x,         y: info.pos.end.y   - info.pos.start.y          };
        info.center.pos =   { x: info.pos.start.x   + info.pos.delta.x * 0.5,   y: info.pos.start.y + info.pos.delta.y * 0.5    };
        info.center.start = { x: info.pos.start.x   - info.pos.delta.x,         y: info.pos.start.y - info.pos.delta.y          };
        info.center.end =   { x: info.pos.delta.x * 2,                          y: info.pos.delta.y * 2                         };
        info.radius = Math.sqrt( Math.pow(info.pos.delta.x, 2) + Math.pow(info.pos.delta.y, 2) );
        info.side.short = Math.min( Math.abs(info.pos.delta.x), Math.abs(info.pos.delta.y) );
        console.debug(`Attempting to draw. Prepared drawing info: ${info}`);


        console.debug(`Attempting to draw. Pattern selected: ${pattern}`);
        switch (pattern) {
            case CanvasShapeHelper.PATTERN_RECT:
                this.DrawRect(drawingPath, path, info);
                break;
            case CanvasShapeHelper.PATTERN_CIRCLE:
                this.DrawCircle(drawingPath, path, info);
                break;
            case CanvasShapeHelper.PATTERN_ELLIPSE:
                this.DrawEllipse(drawingPath, path, info);
                break;
            case CanvasShapeHelper.PATTERN_IMAGE:
            default:
            case CanvasShapeHelper.PATTERN_NONE:
                break;
        }

        console.debug(`Attempting to draw. Mode selected: ${mode}`);
        switch (mode) {
            case CanvasShapeHelper.MODE_FILL:
                layer.fill(drawingPath);
                break;
            case CanvasShapeHelper.MODE_STROKE:
                layer.stroke(drawingPath);
                break;
            case CanvasShapeHelper.MODE_NONE:
            default:
                break;
        }
        console.debug(`Draw finished`);
        console.count("Draw");
    }

    /**
     * Changes the option to a determined value.
     * @param {string} option The option to change. Can be either [PATTERN]{@link CanvasShapeHelper.PATTERN},
     * [MODE]{@link CanvasShapeHelper.MODE},
     * [PATH]{@link CanvasShapeHelper.PATH}
     * @param {string} value The value of the option to change. Depends on the option.
     * @constructor
     */
    Change(option, value) {
        console.debug(`Attempting to change: ${option}.`);
        switch (option) {
            case CanvasShapeHelper.PATTERN:
                if(CanvasShapeHelper.PATTERNS.includes(value)) {
                    const patternChangeEvent = new CustomEvent(CanvasShapeHelper.PATTERN_CHANGE, { detail: value });
                    this.currentPattern = value;
                    this.TriggerEvent(CanvasShapeHelper.PATTERN_CHANGE, patternChangeEvent);
                } else console.debug(`The value: ${value} is not valid for the option: ${option}`);
                break;
            case CanvasShapeHelper.PATH:
                if(CanvasShapeHelper.PATHS.includes(value)) {
                    const patternChangeEvent = new CustomEvent(CanvasShapeHelper.PATH_CHANGE, { detail: value });
                    this.currentPath = value;
                    this.TriggerEvent(CanvasShapeHelper.PATH_CHANGE, patternChangeEvent);
                } else console.debug(`The value: ${value} is not valid for the option: ${option}`);
                break;
            case CanvasShapeHelper.MODE:
                if(CanvasShapeHelper.MODES.includes(value)) {
                    const patternChangeEvent = new CustomEvent(CanvasShapeHelper.MODE_CHANGE, { detail: value });
                    this.currentMode = value;
                    this.TriggerEvent(CanvasShapeHelper.MODE_CHANGE, patternChangeEvent);
                } else console.debug(`The value: ${value} is not valid for the option: ${option}`);
                break;
            default:
                console.debug(`The option is not valid: ${option}`);
                break;
        }
    }

    /**
     * Obtains the mode available for a determined pattern.
     * @param {string} pattern The pattern to check against.
     * @return {string[]}
     * @constructor
     */
    GetAvailableMode(pattern) {
        const available = [];
        switch (pattern) {
            case CanvasShapeHelper.PATTERN_CIRCLE:
            case CanvasShapeHelper.PATTERN_RECT:
            case CanvasShapeHelper.PATTERN_ELLIPSE:
                available.push(CanvasShapeHelper.MODE_STROKE);
            case CanvasShapeHelper.PATTERN_IMAGE:
                available.push(CanvasShapeHelper.MODE_FILL);
            default:
                available.push(CanvasShapeHelper.MODE_NONE);
                break;
        }
        return available;
    }
    /**
     * Obtains the PAth available for a determined pattern.
     * @param {string} pattern The pattern to check against.
     * @return {string[]}
     * @constructor
     */
    GetAvailablePath(pattern) {
        const available = [];
        switch (pattern) {
            case CanvasShapeHelper.PATTERN_CIRCLE:
                available.push(CanvasShapeHelper.PATH_DIA);
            case CanvasShapeHelper.PATTERN_RECT:
                available.push(CanvasShapeHelper.PATH_RADIUS);
            case CanvasShapeHelper.PATTERN_ELLIPSE:
                available.push(CanvasShapeHelper.PATH_VERTEX);
            case CanvasShapeHelper.PATTERN_IMAGE:
            default:
                available.push(CanvasShapeHelper.PATH_NONE);
                break;
        }
        return available;
    }


    /**** Events ****/
    static PATTERN_CHANGE = "changepattern";
    static MODE_CHANGE = "changemode";
    static PATH_CHANGE = "changepath";
    static DRAW = "draw";
    static DRAWING = "drawing";


    static PATTERN = "pattern";
    static MODE = "mode";
    static PATH = "path";

    static PATTERN_NONE = "pattern-none";
    static PATTERN_RECT = "pattern-rect";
    static PATTERN_CIRCLE = "pattern-circle";
    static PATTERN_ELLIPSE = "pattern-ellipse";
    static PATTERN_IMAGE = "pattern-image";

    static PATTERNS = [
        CanvasShapeHelper.PATTERN_NONE,
        CanvasShapeHelper.PATTERN_RECT,
        CanvasShapeHelper.PATTERN_CIRCLE,
        CanvasShapeHelper.PATTERN_ELLIPSE,
        CanvasShapeHelper.PATTERN_IMAGE
    ];

    static MODE_NONE = "mode-none";
    static MODE_FILL = "mode-fill";
    static MODE_STROKE = "mode-stroke";
    static MODES = [
        CanvasShapeHelper.MODE_NONE,
        CanvasShapeHelper.MODE_FILL,
        CanvasShapeHelper.MODE_STROKE
    ];
    static PATH_NONE = "path-none";
    static PATH_VERTEX = "path-vertex";
    static PATH_RADIUS = "path-radius";
    static PATH_DIA = "path-dia";
    static PATHS = [
        CanvasShapeHelper.PATH_NONE,
        CanvasShapeHelper.PATH_VERTEX,
        CanvasShapeHelper.PATH_RADIUS,
        CanvasShapeHelper.PATH_DIA
    ];
}