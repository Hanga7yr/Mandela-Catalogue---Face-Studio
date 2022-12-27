import { CanvasDrawingHelper } from "/js/app1/CanvasDrawingHelper.js";
import { CanvasHelper } from "/js/app1/CanvasHelper.js";


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

    GenerateLayers(layer, parentElement) {
        this.uvMap = CanvasHelper.GenerateLayer(layer++, parentElement);
        this.layers[CanvasUVHelper.SIDE_FRONT] = CanvasHelper.GenerateLayer(layer++, parentElement);
        this.layers[CanvasUVHelper.SIDE_LEFT] = CanvasHelper.GenerateLayer(layer++, parentElement);
        this.layers[CanvasUVHelper.SIDE_RIGHT] = CanvasHelper.GenerateLayer(layer++, parentElement);

        this.uvMap.canvas.addEventListener("change", this.OnLayerUpdate.bind(this));
        this.layers[CanvasUVHelper.SIDE_FRONT].canvas.setAttribute("data-target", CanvasUVHelper.SIDE_FRONT);
        this.layers[CanvasUVHelper.SIDE_LEFT].canvas.setAttribute("data-target", CanvasUVHelper.SIDE_LEFT);
        this.layers[CanvasUVHelper.SIDE_RIGHT].canvas.setAttribute("data-target", CanvasUVHelper.SIDE_RIGHT);

        return [this.uvMap].concat(this.layers);
    }

    OnLayerUpdate(e) {
        if(this.uvMapData && this.shouldShowUVMapData) {
            this.uvMap.drawImage(this.uvMapData, 0, 0, e.target.clientWidth, e.target.clientHeight);

            this.ObtainMaskedArea(CanvasUVHelper.SIDE_FRONT, this.mask[CanvasUVHelper.SIDE_FRONT]);
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
     * @param {Path2D[]} mask
     * @return {ImageData}
     * @constructor
     */
    ObtainMaskedArea(side, mask) {
        const width = this.layers[side].canvas.clientWidth;
        const height = this.layers[side].canvas.clientHeight;
        this.layers[side].clearRect(0, 0, width, height);

        mask.forEach(mask => this.layers[side].fill(mask));
        this.layers[side].globalCompositeOperation = "source-in";

        this.layers[side].drawImage(this.bitmap[side], 0, 0, this.layers[side].canvas.clientWidth, this.layers[side].canvas.clientHeight);

        this.layers[side].globalCompositeOperation = "source-over";

        let maskedImageData = this.layers[side].getImageData(0, 0, width, height);
        let chunkedMaskedImageData = [];
        let chunkedSRGBMaskedImageData = [];
        let reducedMaskedImageData = [];
        for(let i = 0; i < height; i++)
            chunkedMaskedImageData[i] = maskedImageData.data.slice((i * width * 4), (i * width * 4) + width * 4);
        maskedImageData = []; // Clear memory...
        for(let i = 0; i < height; i++) {
            chunkedSRGBMaskedImageData[i] = [];
            for(let j = 0; j < width; j++)
                chunkedSRGBMaskedImageData[i][j] = chunkedMaskedImageData[i].slice(j * 4, (j * 4) + 4);
        }
        chunkedMaskedImageData = []; // Clear memory...
        let top = -1;
        let left = -1;
        let right = -1;
        let bottom = -1;

        let shouldStop = false;
        for(let i = 0; i < height && !shouldStop; i++) {
            shouldStop = chunkedSRGBMaskedImageData[i].some(pixel => pixel.some(rgba => rgba != 0));
            if(shouldStop) top = i;
        }

        shouldStop = false;
        for(let i = height - 1; i >= 0 && !shouldStop; i--) {
            shouldStop = chunkedSRGBMaskedImageData[i].some(pixel => pixel.some(rgba => rgba != 0));
            if(shouldStop) bottom = i;
        }

        chunkedSRGBMaskedImageData.splice(bottom, height);
        chunkedSRGBMaskedImageData.splice(0, top);

        this.layers[side].clearRect(0, 0, width, height);

        debugger;

        createImageBitmap(new ImageData(
            Uint8ClampedArray.from(chunkedSRGBMaskedImageData
                .flatMap(pixel =>
                        pixel
                            .flatMap(rgba =>
                                [rgba[0], rgba[1], rgba[2], rgba[3]]
                            )
                )),
                width,
            bottom - top)
        ).then(bitmap =>
            this.layers[side].drawImage(bitmap, 0, top, this.layers[side].canvas.clientWidth, bottom - top)
        );


        // On move modify transform, and redraw to move the masked zone over??
    }

    /**
     *
     * @param {number} side
     * @param {Path2D[]} mask
     * @constructor
     */
    SetMaskedArea(side, mask) {
        this.mask[side] = mask;
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