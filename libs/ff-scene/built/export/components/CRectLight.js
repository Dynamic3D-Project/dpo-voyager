"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const Component_1 = require("@ff/graph/Component");
const CLight_1 = require("./CLight");
////////////////////////////////////////////////////////////////////////////////
class CRectLight extends CLight_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CRectLight.rectLightIns);
        this.object3D = new three_1.RectAreaLight();
        this.light.width = 1;
        this.light.height = 1;
        this.object3D.matrixAutoUpdate = false;
        this.transform.ins.scale.addEventListener("value", this.update, this);
    }
    get light() {
        return this.object3D;
    }
    update(context) {
        super.update(context);
        const light = this.light;
        const ins = this.ins;
        if (ins.position.changed || ins.target.changed) {
            light.position.fromArray(ins.position.value);
            light.lookAt(new three_1.Vector3().fromArray(ins.target.value));
            light.updateMatrix();
        }
        //RectAreaLight's size ignores scaling
        this.light.width = this.transform.ins.scale.value[0] * 10;
        this.light.height = this.transform.ins.scale.value[2] * 10;
        return true;
    }
    dispose() {
        super.dispose();
        this.transform.ins.scale.removeEventListener("value", this.update);
    }
}
CRectLight.typeName = "CRectLight";
CRectLight.rectLightIns = {
    position: Component_1.types.Vector3("Light.Position", [0, 0, 0]),
    target: Component_1.types.Vector3("Light.Target", [0, -1, 0]),
    size: Component_1.types.Vector2("Light.Size", [10, 10]),
};
exports.default = CRectLight;
//# sourceMappingURL=CRectLight.js.map