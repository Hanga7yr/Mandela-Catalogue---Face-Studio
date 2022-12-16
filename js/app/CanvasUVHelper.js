import { CanvasDrawingHelper } from "js/app/CanvasDrawingHelper.js";
import {CanvasHelper} from "./CanvasHelper";


export class CanvasUVHelper extends CanvasDrawingHelper {
    /**
     * Stores the data of the uvmap.
     * @type {ImageBitmap}
     */
    uvMapData;

    /**
     * The layer where changes to the leftSide will be applied.
     * @type {CanvasRenderingContext2D}
     */
    leftSide;
    /**
     The layer where changes to the rightSide will be applied.
     * @type {CanvasRenderingContext2D}
     */
    rightSide;
    /**
     The layer where changes to the frontSide will be applied.
     * @type {CanvasRenderingContext2D}
     */
    frontSide;


    constructor(props) {
        super(props);

    }

    GenerateLayers(layer) {
        this.leftSide = CanvasHelper.GenerateLayer(layer++);
        this.rightSide = CanvasHelper.GenerateLayer(layer++);
        this.frontSide = CanvasHelper.GenerateLayer(layer++);

        return [this.leftSide, this.rightSide, this.frontSide];
    }
}