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

    constructor() {
        super();

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

        layer.beginPath();
        switch (this.drawingPattern) {
            case CanvasPatternHelper.PATTERN_RECT:
                switch (this.drawingPath) {
                    case CanvasPatternHelper.PATH_VERTEX:
                        layer.rect(
                            startPos.x, startPos.y,
                            deltaPos[0], deltaPos[1]
                        );
                        break;
                    case CanvasPatternHelper.PATH_RADIUS:
                        const xCenter = startPos.x - (deltaPos[0]);
                        const yCenter = startPos.y - (deltaPos[1]);

                        const xEnd = deltaPos[0]*2;
                        const yEnd = deltaPos[1]*2;

                        layer.rect(
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
                        layer.arc(
                            xCenter, yCenter, Math.min(Math.abs(deltaPos[0]), Math.abs(deltaPos[1]))*0.5,
                            0, 2 * Math.PI
                        );
                        break;
                    case CanvasPatternHelper.PATH_RADIUS:
                        layer.arc(
                            startPos.x, startPos.y, radius,
                            0, 2 * Math.PI
                        );
                        break;
                    case CanvasPatternHelper.PATH_DIA:
                        const radiusDia = Math.sqrt(
                            Math.pow((deltaPos[0]*0.5), 2) + Math.pow((deltaPos[1]*0.5), 2)
                        );

                        layer.arc(
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
                        layer.ellipse(
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
        layer.closePath();

        switch (this.drawingMode) {
            case CanvasPatternHelper.MODE_FILL:
                layer.fill();
                break;
            case CanvasPatternHelper.MODE_STROKE:
                layer.stroke();
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

    static PATTERN_NONE = 0;
    static PATTERN_RECT = 1;
    static PATTERN_CIRCLE = 2;
    static PATTERN_ELLIPSE = 3;
    static PATTERN_IMAGE = 4;

    static MODE_NONE = 0;
    static MODE_FILL = 1;
    static MODE_STROKE = 2;

    static PATH_NONE = 0;
    static PATH_VERTEX = 1;
    static PATH_RADIUS = 2;
    static PATH_DIA = 3;
}