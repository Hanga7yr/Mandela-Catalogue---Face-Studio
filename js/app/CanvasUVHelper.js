import { CanvasDrawingHelper } from "/js/app/CanvasDrawingHelper.js";
import { CanvasHelper } from "/js/app/CanvasHelper.js";


export class CanvasUVHelper extends CanvasDrawingHelper {
    /**
     * Stores the data of the uvmap.
     * @type {ImageBitmap}
     */
    uvMapData;

    /**
     * The layer where the uv map will be rendered.
     * @type {CanvasRenderingContext2D}
     */
    uvMap;

    shouldShowUVMapData = false;

    /**
     * The layers
     * @type {CanvasRenderingContext2D[]}
     */
    layers = [];

    /**
     * The bitmaps with the images to where to get the info.
     * @type {ImageBitmap[]}
     */
    bitmap = [];

    /**
     * The Paths to extract data from bitmaps
     * @type {Path2D[][]}
     */
    mask = [];


    constructor(props) {
        super(props);

        this.onSideChange = [];

        const img = new Image();
        img.src = "/assets/images/uvmapping.png";
        img.addEventListener("load", (event) => {
            createImageBitmap(event.target).then((bitmap) => this.uvMapData = bitmap);
        });
    }

    GenerateLayers(layer) {
        this.uvMap = CanvasHelper.GenerateLayer(layer++);
        this.layers[CanvasUVHelper.SIDE_FRONT] = CanvasHelper.GenerateLayer(layer++);
        this.layers[CanvasUVHelper.SIDE_LEFT] = CanvasHelper.GenerateLayer(layer++);
        this.layers[CanvasUVHelper.SIDE_RIGHT] = CanvasHelper.GenerateLayer(layer++);

        this.uvMap.canvas.addEventListener("change", this.OnLayerUpdate.bind(this));
        this.layers[CanvasUVHelper.SIDE_FRONT].canvas.setAttribute("data-target", CanvasUVHelper.SIDE_FRONT);
        this.layers[CanvasUVHelper.SIDE_LEFT].canvas.setAttribute("data-target", CanvasUVHelper.SIDE_LEFT);
        this.layers[CanvasUVHelper.SIDE_RIGHT].canvas.setAttribute("data-target", CanvasUVHelper.SIDE_RIGHT);

        return [this.uvMap].concat(this.layers);
    }

    OnLayerUpdate(e) {
        if(this.uvMapData && this.shouldShowUVMapData) {
            e.target.getContext("2d").drawImage(this.uvMapData, 0, 0, e.target.clientWidth, e.target.clientHeight);
        }
    }

    /**
     *
     * @param {number} side
     * @param {ImageBitmap} imageData
     * @constructor
     */
    SetSideImageData(side, imageData) {
        this.bitmap[side] = imageData;
    }

    /**
     *
     * @param {number} side
     * @param {Path2D[]} pathData
     * @constructor
     */
    SetSideMask(side, pathData) {
        this.mask[side] = pathData;
    }

    /**
     *
     * @param {number} side
     * @constructor
     */
    ShowSide(side) {
        if(side != 0 && side != -1 && this.bitmap[side]) this.layers[side].drawImage(this.bitmap[side], 0, 0, this.layers[side].canvas.clientWidth, this.layers[side].canvas.clientHeight);
        this.onSideChange.forEach((handlers) => handlers(side != -1 ? side : 0));
    }

    ToggleShowUVMapping(value = null) {
        this.shouldShowUVMapData = value ? value : !this.shouldShowUVMapData;
    }

    /**
     *
     * @param {number} side
     * @param {CanvasRenderingContext2D} layer
     * @param {Path2D[]} mask
     * @constructor
     */
    ObtainMaskedArea(side, mask) {
        this.mask[side] = mask;
        document.layer = this.layers[side];
        document.mask = mask;
        document.image = this.bitmap[side];

        mask.forEach(mask => this.layers[side].fill(mask));
        this.layers[side].globalCompositeOperation = "source-in";

        this.layers[side].drawImage(this.bitmap[side], 0, 0, this.layers[side].canvas.clientWidth, this.layers[side].canvas.clientHeight);

        this.layers[side].globalCompositeOperation = "source-over";

        // On move modify transform, and redraw to move the masked zone over??
    }



    /**
     * EventHandlers on the case the utility should show a side.
     * @type {Array<function(number):void>}
     */
    onSideChange;
    /**
     * Adds a handler to the onSide Show event.
     * @param {function(number):void} eventHandler
     */
    AddOnSideShowEventHandler(eventHandler) {
        if(!this.onSideChange.includes(eventHandler))
            this.onSideChange.push(eventHandler);
    }

    static SIDE_NONE = 0;
    static SIDE_FRONT = 1;
    static SIDE_LEFT = 2;
    static SIDE_RIGHT = 3;
}