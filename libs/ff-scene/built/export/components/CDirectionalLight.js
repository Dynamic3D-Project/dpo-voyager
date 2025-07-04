"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const Component_1 = require("@ff/graph/Component");
const CLight_1 = require("./CLight");
////////////////////////////////////////////////////////////////////////////////
class CDirectionalLight extends CLight_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CDirectionalLight.dirLightIns);
        this.object3D = new three_1.DirectionalLight();
        this.light.target.matrixAutoUpdate = false;
    }
    get light() {
        return this.object3D;
    }
    update(context) {
        super.update(context);
        const light = this.light;
        const ins = this.ins;
        if (ins.color.changed || ins.intensity.changed) {
            light.intensity = ins.intensity.value * Math.PI; //TODO: Remove PI factor when we can support physically correct lighting units
        }
        if (ins.position.changed || ins.target.changed) {
            light.position.fromArray(ins.position.value);
            light.target.position.fromArray(ins.target.value);
            light.updateMatrix();
            light.target.updateMatrix();
        }
        if (ins.shadowSize.changed) {
            const camera = light.shadow.camera;
            const halfSize = ins.shadowSize.value * 0.5;
            camera.left = camera.bottom = -halfSize;
            camera.right = camera.top = halfSize;
            camera.near = 0.05 * ins.shadowSize.value;
            camera.far = 50 * ins.shadowSize.value;
            camera.updateProjectionMatrix();
        }
        return true;
    }
    onAddToParent(parent) {
        super.onAddToParent(parent);
        parent.add(this.light.target);
    }
    onRemoveFromParent(parent) {
        super.onRemoveFromParent(parent);
        parent.remove(this.light.target);
    }
}
CDirectionalLight.typeName = "CDirectionalLight";
CDirectionalLight.dirLightIns = {
    position: Component_1.types.Vector3("Light.Position"),
    target: Component_1.types.Vector3("Light.Target", [0, -1, 0]),
    shadowSize: Component_1.types.Number("Shadow.Size", {
        preset: 100,
        min: 0,
    }),
};
exports.default = CDirectionalLight;
//# sourceMappingURL=CDirectionalLight.js.map