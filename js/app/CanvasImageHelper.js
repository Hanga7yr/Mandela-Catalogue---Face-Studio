import { CanvasEventHelper } from "./CanvasEventHelper";

export class CanvasImageHelper {
    static MODE_NONE = 0;
    static MODE_FILL_CANVAS = 1;
    static MODE_DRAW_CANVAS = 2;

    static EDIT_NONE = 0;
    static EDIT_MOVE = 1;
    static EDIT_ROTATE = 2;
    static EDIT_TRANSFORM = 3;


    buffer = [];
    target = [];

    startingPosition = [];
    movingPosition = [];
    endPosition = [];

    isInteractive = false;
    isAllowedPermanent = true;
    shouldCleanOnDraw = true;
    shouldDraw = true;

    constructor() {

    }

    GetActualPosition(clientX, clientY, canvasX, canvasY) {
        const x = clientX - canvasX;
        const y = clientY - canvasY;

        return [x, y];
    }

    /**
     * Adds layer to the canvas helper
     * @param {CanvasEventHelper} canvasHelper
     * @constructor
     */
    AddLayers(canvasHelper) {
        canvasHelper.AddLayer();
    }
}