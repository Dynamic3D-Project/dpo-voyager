"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EBackgroundStyle = void 0;
const CObject3D_1 = require("./CObject3D");
const Background_1 = require("@ff/three/Background");
Object.defineProperty(exports, "EBackgroundStyle", { enumerable: true, get: function () { return Background_1.EBackgroundStyle; } });
class CBackground extends CObject3D_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CBackground.backgroundIns);
        this.object3D = new Background_1.default();
    }
    get background() {
        return this.object3D;
    }
    update(context) {
        super.update(context);
        const ins = this.ins;
        const material = this.background.material;
        if (ins.style.changed) {
            material.style = ins.style.getValidatedValue();
        }
        if (ins.color0.changed) {
            material.color0.fromArray(ins.color0.value);
        }
        if (ins.color1.changed) {
            material.color1.fromArray(ins.color1.value);
        }
        if (ins.noise.changed) {
            material.noise = ins.noise.value;
        }
        return true;
    }
    dispose() {
        this.background.dispose();
        super.dispose();
    }
}
CBackground.typeName = "CBackground";
CBackground.backgroundIns = {
    style: CObject3D_1.types.Enum("Background.Style", Background_1.EBackgroundStyle, Background_1.EBackgroundStyle.RadialGradient),
    color0: CObject3D_1.types.ColorRGB("Background.Color0", [0.2, 0.25, 0.3]),
    color1: CObject3D_1.types.ColorRGB("Background.Color1", [0.01, 0.03, 0.05]),
    noise: CObject3D_1.types.Number("Background.Noise", { min: 0, max: 1, bar: true, preset: 0.02 }),
};
exports.default = CBackground;
//# sourceMappingURL=CBackground.js.map