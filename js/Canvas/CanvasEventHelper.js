import { CanvasHelper } from '/js/Canvas/CanvasHelper.js';
import { UIHelper } from '/js/UI/UIHelper.js';
export class CanvasEventHelper extends CanvasHelper {

    /** @type {string[]} */
    state;

    constructor() {
        super();

        this.CreateEvent(CanvasEventHelper.MOUSE_UP);
        this.CreateEvent(CanvasEventHelper.MOUSE_DOWN);
        this.CreateEvent(CanvasEventHelper.MOUSE_DOWN_MOVE);
        this.CreateEvent(CanvasEventHelper.MOUSE_ENTER);
        this.CreateEvent(CanvasEventHelper.MOUSE_LEAVE);
        this.CreateEvent(CanvasEventHelper.MOUSE_MOVE);

        this.state = [];
    }

    Generate(currentLayer) {
        const layer = CanvasHelper.GenerateLayer(currentLayer++);

        layer.canvas.addEventListener(CanvasEventHelper.MOUSE_UP, this.HandleEvent);
        layer.canvas.addEventListener(CanvasEventHelper.MOUSE_DOWN, this.HandleEvent);
        layer.canvas.addEventListener(CanvasEventHelper.MOUSE_ENTER, this.HandleEvent);
        layer.canvas.addEventListener(CanvasEventHelper.MOUSE_LEAVE, this.HandleEvent);
        layer.canvas.addEventListener(CanvasEventHelper.MOUSE_MOVE, this.HandleEvent);

        return layer;
    }

    IsState(state) {
        return state === CanvasEventHelper.MOUSE_UP
            || state === CanvasEventHelper.MOUSE_DOWN
            || state === CanvasEventHelper.MOUSE_MOVE
            || state === CanvasEventHelper.MOUSE_DOWN_MOVE
            || state === CanvasEventHelper.MOUSE_ENTER
            || state === CanvasEventHelper.MOUSE_LEAVE;
    }
    AddState(state) { if(!this.state.includes(state) && this.IsState(state)) this.state.push(state) }
    RemoveState(state) { const pos = this.state.indexOf(state); if(pos != -1) this.state.splice(pos, 1); }
    ContainsState(state) { return this.state.includes(state); }
    HandleEvent(event) {
        console.debug(`Interception of event: ${event}.`);

        switch (event.type) {
            case CanvasEventHelper.MOUSE_DOWN:
                this.AddState(CanvasEventHelper.MOUSE_DOWN);
                this.RemoveState(CanvasEventHelper.MOUSE_UP);
                this.TriggerEvent(CanvasEventHelper.MOUSE_DOWN, event);

                if(this.ContainsState(CanvasEventHelper.MOUSE_MOVE))
                    this.TriggerEvent(CanvasEventHelper.MOUSE_DOWN_MOVE, event);
                break;
            case CanvasEventHelper.MOUSE_UP:
                this.AddState(CanvasEventHelper.MOUSE_UP);
                if(this.ContainsState(CanvasEventHelper.MOUSE_DOWN))
                    this.TriggerEvent(CanvasEventHelper.MOUSE_DOWN_UP, event);
                this.RemoveState(CanvasEventHelper.MOUSE_DOWN);
                this.TriggerEvent(CanvasEventHelper.MOUSE_UP, event);
                break;
            case CanvasEventHelper.MOUSE_ENTER:
                this.AddState(CanvasEventHelper.MOUSE_ENTER);
                this.RemoveState(CanvasEventHelper.MOUSE_LEAVE);
                break;
            case CanvasEventHelper.MOUSE_LEAVE:
                this.AddState(CanvasEventHelper.MOUSE_LEAVE);
                this.RemoveState(CanvasEventHelper.MOUSE_ENTER);
                break;
            default:
                this.AddState(event.type);
                this.TriggerEvent(event.type, event);
                break;
        }
    }

    static MOUSE_UP = "mouseup";
    static MOUSE_DOWN = "mousedown";
    static MOUSE_DOWN_MOVE = "mousedownmove";
    static MOUSE_DOWN_UP = "mousedownup";
    static MOUSE_MOVE = "mousemove";
    static MOUSE_ENTER = "mouseenter";
    static MOUSE_LEAVE = "mouseleave";
}