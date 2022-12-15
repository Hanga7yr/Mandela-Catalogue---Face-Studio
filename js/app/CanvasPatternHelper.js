export class CanvasPatternHelper {
    startingPosition = [];
    movingPosition = [];
    endPosition = [];
    points = [];

    drawingMode = CanvasPatternHelper.MODE_NONE;
    drawingPathMode = CanvasPatternHelper.MODE_NONE;
    drawingPattern = CanvasPatternHelper.PATTERN_NONE;
    drawingState = CanvasPatternHelper.STATE_NONE;

    static PATTERN_NONE = 0;
    static PATTERN_RECT = 1;
    static PATTERN_CIRCLE = 2;
    static PATTERN_ELLIPSE = 3;

    static MODE_NONE = 0;
    static MODE_FILL = 1;
    static MODE_STROKE = 2;

    static PATH_NONE = 0;
    static PATH_VERTEX = 1;
    static PATH_RADIUS = 2;
    static PATH_DIA = 3;

    static STATE_NONE = 0;
    static STATE_START_POS = 1;
    static STATE_MORE_POS = 2;
    static STATE_END_POS = 3;


    fillStyle = "rgb(255, 255, 255)";
    strokeStyle = "rgb(255, 255, 255)";

    isInteractive = false;
    isAllowedPermanent = true;
    shouldCleanOnDraw = true;
    shouldDraw = true;

    buffer = [];
    target = [];

    constructor() {

    }

    GetActualPosition(clientX, clientY, canvasX, canvasY) {
        const x = clientX - canvasX;
        const y = clientY - canvasY;

        return [x, y];
    }

    onMouseDownHandler(event) {
        const canvasRect = this.buffer[1].getBoundingClientRect();
        const currentPos = this.GetActualPosition(
            event.clientX, event.clientY,
            canvasRect.x, canvasRect.y
        );

        switch (this.drawingState) {
            case CanvasPatternHelper.STATE_NONE:
                this.AssignStartPosition(currentPos);
                break;
            case CanvasPatternHelper.STATE_START_POS:
                if(this.isInteractive) {
                    this.AssignMovingPosition(currentPos);
                }
                break;
        }

        if(this.isInteractive && this.shouldDraw) this.Draw(this.buffer[0]);
    }

    onMouseUpHandler(event, canvasHelper) {
        const canvasRect = this.buffer[1].getBoundingClientRect();
        const currentPos = this.GetActualPosition(
            event.clientX, event.clientY,
            canvasRect.x, canvasRect.y
        );

        switch (this.drawingState) {
            case CanvasPatternHelper.STATE_NONE:
            default:
                break;
            case CanvasPatternHelper.STATE_START_POS:
                this.AssignEndPosition(currentPos);
                break;
        }

        if(this.shouldDraw) this.Draw(this.buffer[0]);
        if(this.isAllowedPermanent) this.DrawToPermanent(this.target[0]);
        this.ClearLayer(this.buffer[0]);
        this.Reset();
    }

    CheckPoints() {
        switch (this.drawingPattern) {
            case CanvasPatternHelper.PATTERN_NONE:
            case CanvasPatternHelper.PATTERN_CIRCLE:
            case CanvasPatternHelper.PATTERN_RECT:
            default:
                break;
        }
    }

    SetActiveLayer(layer) {
        this.target[0] = layer;
        this.target[1] = layer.canvas;
    }

    SetBufferLayer(layer) {
        this.buffer[0] = layer;
        this.buffer[1] = layer.canvas;
    }

    AssignStartPosition(arrayPos) {
        this.startingPosition = arrayPos;
        this.drawingState = CanvasPatternHelper.STATE_START_POS;
    }

    AssignMovingPosition(arrayPos) {
        this.movingPosition = arrayPos;
    }

    AssignEndPosition(arrayPos) {
        this.endPosition = arrayPos;
        this.drawingState = CanvasPatternHelper.STATE_END_POS;
    }

    AddPoint(arrayPos) {
        this.points.push(arrayPos);
    }

    SetFill(fillStyle) {
        this.fillStyle = fillStyle;
    }

    SetStroke(strokeStyle) {
        this.strokeStyle = strokeStyle;
    }

    Reset() {
        this.startingPosition = this.endPosition = this.movingPosition = this.points = [];
        this.drawingState = CanvasPatternHelper.STATE_NONE;
    }

    DrawToPermanent(layer) {
        const isInteractive = this.isInteractive;
        this.isInteractive = false;

        this.Draw(layer);

        this.isInteractive = isInteractive;
    }

    ClearLayer(layer) {
        layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    }

    Draw(layer) {
        if(this.isInteractive && this.shouldCleanOnDraw) this.ClearLayer(layer);

        const startPos = this.startingPosition;
        const endPos = this.isInteractive ? this.movingPosition : this.endPosition;
        let deltaPos = [endPos[0]-startPos[0], endPos[1]-startPos[1]];
        const radius = Math.sqrt(Math.pow(deltaPos[0], 2) + Math.pow(deltaPos[1], 2));
        const xCenter = startPos[0] + deltaPos[0]*0.5;
        const yCenter = startPos[1] + deltaPos[1]*0.5;

        layer.beginPath();
        switch (this.drawingPattern) {
            case CanvasPatternHelper.PATTERN_RECT:
                switch (this.drawingPathMode) {
                    case CanvasPatternHelper.PATH_VERTEX:
                        layer.rect(
                            startPos[0], startPos[1],
                            deltaPos[0], deltaPos[1]
                        );
                        break;
                    case CanvasPatternHelper.PATH_RADIUS:
                        const xCenter = startPos[0] - (deltaPos[0]);
                        const yCenter = startPos[1] - (deltaPos[1]);

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
                switch (this.drawingPathMode) {
                    case CanvasPatternHelper.PATH_VERTEX:
                        layer.arc(
                            xCenter, yCenter, Math.min(Math.abs(deltaPos[0]), Math.abs(deltaPos[1]))*0.5,
                            0, 2 * Math.PI
                        );
                        break;
                    case CanvasPatternHelper.PATH_RADIUS:
                        layer.arc(
                            startPos[0], startPos[1], radius,
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
                switch (this.drawingPathMode) {
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
                layer.closePath();
                break;
            case CanvasPatternHelper.PATTERN_NONE:
                layer.closePath();
            default:
                break;
        }

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
}