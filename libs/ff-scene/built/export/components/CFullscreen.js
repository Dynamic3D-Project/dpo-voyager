"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("@ff/graph/Component");
////////////////////////////////////////////////////////////////////////////////
class CFullscreen extends Component_1.default {
    get fullscreenElement() {
        return this._fullscreenElement;
    }
    set fullscreenElement(element) {
        if (element !== this._fullscreenElement) {
            if (this._fullscreenElement) {
                this._fullscreenElement.removeEventListener("fullscreenchange", this.onFullscreenChange);
            }
            this._fullscreenElement = element;
            if (element) {
                element.addEventListener("fullscreenchange", this.onFullscreenChange);
            }
        }
    }
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CFullscreen.ins);
        this.outs = this.addOutputs(CFullscreen.outs);
        this._fullscreenElement = null;
        this.onFullscreenChange = this.onFullscreenChange.bind(this);
        const e = document.documentElement;
        const fullscreenAvailable = e.requestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullscreen;
        this.outs.fullscreenAvailable.setValue(!!fullscreenAvailable);
        this.ins.toggle.on("value", this.toggle, this);
    }
    update(context) {
        return true;
    }
    toggle() {
        const outs = this.outs;
        const e = this._fullscreenElement;
        if (e) {
            const state = outs.fullscreenActive.value;
            if (!state && outs.fullscreenAvailable.value) {
                if (e.requestFullscreen) {
                    e.requestFullscreen();
                }
                else if (e.mozRequestFullScreen) {
                    e.mozRequestFullScreen();
                }
                else if (e.webkitRequestFullscreen) {
                    e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            }
            else if (state) {
                const d = document;
                if (d.exitFullscreen) {
                    d.exitFullscreen();
                }
                else if (d.cancelFullScreen) {
                    d.cancelFullScreen();
                }
                else if (d.mozCancelFullScreen) {
                    d.mozCancelFullScreen();
                }
                else if (d.webkitCancelFullScreen) {
                    d.webkitCancelFullScreen();
                }
            }
        }
    }
    onFullscreenChange(event) {
        const d = document;
        const element = d.fullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement;
        this.outs.fullscreenActive.setValue(!!element);
    }
}
CFullscreen.typeName = "CFullscreen";
CFullscreen.ins = {
    toggle: Component_1.types.Event("Fullscreen.Toggle"),
};
CFullscreen.outs = {
    fullscreenAvailable: Component_1.types.Boolean("Fullscreen.Available", false),
    fullscreenActive: Component_1.types.Boolean("Fullscreen.Active", false),
};
exports.default = CFullscreen;
//# sourceMappingURL=CFullscreen.js.map