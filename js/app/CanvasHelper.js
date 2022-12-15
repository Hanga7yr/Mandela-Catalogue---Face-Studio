import { CanvasPatternHelper } from '/js/app/CanvasPatternHelper.js';

export class CanvasHelper {
    parentElement;
    layers = [];
    canvas = [];

    mouseDown = false;
    mouseUp = false;

    mouseMoving = true;

    mouseEnter = false;
    mouseLeave = false;

    patternHelper;
    patternHelperAux;

    static LAYER_STORING = 0;
    static LAYER_DRAWING = 1;
    static LAYER_TEMP = 2;
    static LAYER_EVENTS = 3;

    constructor(parentElement) {
        this.parentElement = parentElement;

        // parentElement.classList.add("w-100");
        parentElement.classList.add("position-relative");
        parentElement.classList.add("d-flex");
        parentElement.classList.add("justify-content-center");

        this.AddLayer(1); // StoringLayer
        this.AddLayer(2); // DrawingLayer
        this.AddLayer(3); // TempLayer
        this.AddLayer(4); // EventHandlingLayer

        const eventLayer = this.GetEventLayer();
        eventLayer.fillStyle = "rgb(255, 0, 0)";
        eventLayer.fillRect(
            eventLayer.canvas.width/2, eventLayer.canvas.height/2,
            5, 5
        );

        this.mouseMovingTimeout = setTimeout(this.CheckMouseMoving.bind(this), 100);

        this.patternHelper = new CanvasPatternHelper();
        this.patternHelper.isInteractive = true;
        this.patternHelper.shouldDraw = true;
        this.patternHelper.SetActiveLayer(this.GetDrawingLayer());
        this.patternHelper.SetBufferLayer(this.GetTempLayer());

        this.AddOnMouseMoveFromKeyDown(this.patternHelper.onMouseDownHandler.bind(this.patternHelper));
        this.AddOnMouseUp(this.patternHelper.onMouseUpHandler.bind(this.patternHelper));

        this.patternHelper.drawingPattern = CanvasPatternHelper.PATTERN_NONE;
        this.patternHelper.drawingMode = CanvasPatternHelper.MODE_NONE;
        this.patternHelper.drawingPathMode = CanvasPatternHelper.PATH_NONE;
        this.patternHelper.fillStyle = "rgb(255, 0, 0)";

        this.patternHelperAux = new CanvasPatternHelper();
        this.patternHelperAux.isInteractive = true;
        this.patternHelperAux.isAllowedPermanent = false;
        this.patternHelperAux.shouldCleanOnDraw = false;
        this.patternHelperAux.shouldDraw = false;
        this.patternHelperAux.SetActiveLayer(this.GetDrawingLayer());
        this.patternHelperAux.SetBufferLayer(this.GetTempLayer());

        this.AddOnMouseMoveFromKeyDown(this.patternHelperAux.onMouseDownHandler.bind(this.patternHelperAux));
        this.AddOnMouseUp(this.patternHelperAux.onMouseUpHandler.bind(this.patternHelperAux));

        this.patternHelperAux.drawingPattern = CanvasPatternHelper.PATTERN_RECT;
        this.patternHelperAux.drawingMode = CanvasPatternHelper.MODE_STROKE;
        this.patternHelperAux.drawingPathMode = CanvasPatternHelper.PATH_VERTEX;
    }

    GetDrawingLayer() { return this.layers[CanvasHelper.LAYER_DRAWING]; }
    GetStoringLayer() { return this.layers[CanvasHelper.LAYER_STORING]; }
    GetTempLayer()    { return this.layers[CanvasHelper.LAYER_TEMP];    }
    GetEventLayer()   { return this.layers[CanvasHelper.LAYER_EVENTS];  }

    GetDrawingCanvas() { return this.canvas[CanvasHelper.LAYER_DRAWING]; }
    GetStoringCanvas() { return this.canvas[CanvasHelper.LAYER_STORING]; }
    GetTempCanvas()    { return this.canvas[CanvasHelper.LAYER_TEMP];    }
    GetEventCanvas()   { return this.canvas[CanvasHelper.LAYER_EVENTS];  }

    UpdateLayers() {
        for(const layer of this.layers) {
            layer.canvas.setAttribute("width", this.parentElement.clientWidth);
            layer.canvas.setAttribute("height", this.parentElement.clientHeight);
        }
    }

    AddLayer(zIndex) {
        const newCanvas = document.createElement("canvas");
        this.parentElement.appendChild(newCanvas);

        newCanvas.classList.add("position-absolute");
        newCanvas.classList.add("h-100");
        newCanvas.style.zIndex = zIndex;
        newCanvas.setAttribute("width", this.parentElement.clientWidth);
        newCanvas.setAttribute("height", this.parentElement.clientHeight);

        this.layers.push(newCanvas.getContext("2d"));
        this.canvas.push(newCanvas);
        this.SetEventOnTopCanvas();

        return newCanvas;
    }

    AddEvents(canvas) {
        canvas?.addEventListener('mousemove', this.OnMouseMove.bind(this));
        canvas?.addEventListener('mouseup', this.OnMouseUp.bind(this));
        canvas?.addEventListener('mousedown', this.OnMouseDown.bind(this));
        canvas?.addEventListener('mouseenter', this.OnMouseEnter.bind(this));
        canvas?.addEventListener('mouseleave', this.OnMouseLeave.bind(this));
    }

    RemoveEvents(canvas) {
        canvas?.removeEventListener('mousemove', this.OnMouseMove);
        canvas?.removeEventListener('mouseup', this.OnMouseUp);
        canvas?.removeEventListener('mousedown', this.OnMouseDown);
        canvas?.removeEventListener('mouseenter', this.OnMouseEnter);
        canvas?.removeEventListener('mouseleave', this.OnMouseLeave);
    }

    SetEventOnTopCanvas() {
        for (const canvas of this.canvas) {
            this.RemoveEvents(canvas);
        }

        this.AddEvents(this.canvas[CanvasHelper.LAYER_EVENTS]);
    }

    OnMouseMove(event) {
        console.log("Mouse Move: " + event);
        this.mouseMoving = true;
        this.mouseMovingTimeout = setTimeout(this.CheckMouseMoving, 100);

        if(this.mouseDown && this.mouseEnter) {
            this?.onMouseMoveWithKeyDownHandlers?.forEach((handler) => handler?.call(this, event, this));
        }
    }
    CheckMouseMoving() {
        this.mouseMoving = false;
        clearTimeout(this.mouseMovingTimeout);
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

    OnMouseLeave(event) {
        console.log("Mouse Leave: " + event);
        this.mouseLeave = true;
        this.mouseEnter = false;

        this.OnMouseUp(event);
    }

    onMouseMoveWithKeyDownHandlers = [];
    AddOnMouseMoveFromKeyDown(eventHandler) {
        this.onMouseMoveWithKeyDownHandlers.push(eventHandler);
    }

    onMouseUpHandlers = [];
    AddOnMouseUp(eventHandler) {
        this.onMouseUpHandlers.push(eventHandler);
    }
}