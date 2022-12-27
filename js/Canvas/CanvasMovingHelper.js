import { CanvasHelper } from "/js/app/CanvasHelper.js";
import { UIHelper } from "/js/app1/UIHelper.js";

export class CanvasMovingHelper extends CanvasHelper {
    Generate(layer) {
        const cornerPieces = UIHelper.CreateOrUpdateElement({
            class: ["position-absolute"],
            style: [
                { property: "z-index", value: CanvasHelper.TOP_ZINDEX+1 },
                { property: "width", value: "1rem" },
                { property: "height", value: "1rem" },
                { property: "border-radius", value: ".375rem" },
            ],
        });
        return UIHelper.CreateOrUpdateElement({
            tag: "div",
            id: "canvas-moving-parent",
            class: ["position-absolute", "top-0", "start-0", "border", "border-dark"],
            style: [
                { property: "overflow", value: "visible"},
                { property: "width", value: "500px"},
                { property: "height", value: "500px"},
            ],
            content: [
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-top-left",
                    class: ["top-0", "start-0", "bg-dark"],
                    attributes: [{ property: "data-target", value: "top-left" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-top-center",
                    class: ["top-0", "start-50", "translate-middle-x", "bg-dark"],
                    attributes: [{ property: "data-target", value: "top-center" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-top-right",
                    class: ["top-0", "end-0", "bg-dark"],
                    attributes: [{ property: "data-target", value: "top-right" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-center-left",
                    class: ["top-50", "start-0", "translate-middle-y", "bg-dark"],
                    attributes: [{ property: "data-target", value: "center-left" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-center-center",
                    class: ["top-50", "start-50", "translate-middle", "bg-dark"],
                    attributes: [{ property: "data-target", value: "center-center" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-center-center-top",
                    class: ["start-50", "translate-middle-x", "bg-light"],
                    style: [{ property: "top", value: "40%" }],
                    attributes: [{ property: "data-target", value: "center-center-top" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                    content: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">\n' +
                        '  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>\n' +
                        '  <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>\n' +
                        '</svg>'
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-center-right",
                    class: ["top-50", "end-0", "translate-middle-y", "bg-dark"],
                    attributes: [{ property: "data-target", value: "center-right" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-bottom-left",
                    class: ["bottom-0", "start-0", "bg-dark"],
                    attributes: [{ property: "data-target", value: "bottom-left" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-bottom-center",
                    class: ["bottom-0", "start-50", "translate-middle-x", "bg-dark"],
                    attributes: [{ property: "data-target", value: "bottom-center" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
                UIHelper.CreateOrUpdateElement({
                    id: "canvas-moving-bottom-right",
                    class: ["bottom-0", "end-0", "bg-dark"],
                    attributes: [{ property: "data-target", value: "bottom-right" }],
                    events: [
                        { event: "mousedown", handlers: [this.SelectCorner.bind(this)] },
                        { event: "mouseup", handlers: [this.DropCorner.bind(this)] },
                    ],
                }, cornerPieces.cloneNode()),
            ]
        });
    }

    layer = null;
    /**
     *
     * @param {CanvasRenderingContext2D} layer
     * @constructor
     */
    SetLayer(layer) {
        this.layer = layer;
    }

    selectedCorner = "";
    SelectCorner(e) {
        this.selectedCorner = e.target.getAttribute("data-target");
    }
    MoveCorner(e) {
        if(this.selectedCorner != "") {
            const parentElement = document.getElementById("canvas-moving-parent");
            const cornerToMove = parentElement.querySelectorAll(`[data-target='${this.selectedCorner}']`)[0];
            const position = this.GetActualPosition(e.clientX, e.clientY, parentElement.getBoundingClientRect().x, parentElement.getBoundingClientRect().y);
            parentElement.style.width = Math.ceil(position.x)+"px";
            parentElement.style.height = Math.ceil(position.y)+"px";
        }
    }
    DropCorner(e) {
        this.selectedCorner = "";
    }
}