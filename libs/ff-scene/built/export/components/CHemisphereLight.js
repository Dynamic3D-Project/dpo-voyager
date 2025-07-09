"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const Component_1 = require("@ff/graph/Component");
const CLight_1 = require("./CLight");
////////////////////////////////////////////////////////////////////////////////
/**
 * Implementeation of [HemisphereLight](https://threejs.org/docs/?q=HemisphereLight#api/en/lights/HemisphereLight) from three.js
 * It does NOT work on Standard materials that have a metallic value of 1
 */
class CHemisphereLight extends CLight_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CHemisphereLight.hemiLightIns);
        this.object3D = new three_1.HemisphereLight();
    }
    get light() {
        return this.object3D;
    }
    update(context) {
        super.update(context);
        const light = this.light;
        const ins = this.ins;
        if (ins.ground.changed || ins.intensity.changed) {
            light.groundColor.fromArray(ins.ground.value);
            light.intensity = ins.intensity.value;
        }
        return true;
    }
}
CHemisphereLight.typeName = "CHemisphereLight";
CHemisphereLight.hemiLightIns = {
    ground: Component_1.types.ColorRGB("Light.Ground", [0.31, 0.31, 0.125]),
};
exports.default = CHemisphereLight;
//# sourceMappingURL=CHemisphereLight.js.map