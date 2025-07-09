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
class CSpotLight extends CLight_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CSpotLight.spotLightIns);
        this.object3D = new three_1.SpotLight();
        this.light.target.matrixAutoUpdate = false;
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
            light.target.position.fromArray(ins.target.value);
            light.updateMatrix();
            light.target.updateMatrix();
        }
        if (ins.distance.changed || ins.decay.changed || ins.angle.changed || ins.penumbra.changed) {
            light.distance = ins.distance.value;
            light.decay = ins.decay.value;
            light.angle = ins.angle.value * three_1.MathUtils.DEG2RAD;
            light.penumbra = ins.penumbra.value;
            //SpotLightShadow doesn't handle camera.near for us, but will set camera.far and update the projection matrix
            light.shadow.camera.near = light.distance ? light.distance / 800 : 0.5;
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
CSpotLight.typeName = "CSpotLight";
CSpotLight.spotLightIns = {
    position: Component_1.types.Vector3("Light.Position"),
    target: Component_1.types.Vector3("Light.Target", [0, -1, 0]),
    distance: Component_1.types.Number("Light.Distance", {
        preset: 0,
        min: 0
    }),
    decay: Component_1.types.Number("Light.Decay", 1),
    angle: Component_1.types.Number("Light.Angle", {
        preset: 45,
        min: 0,
        max: 89
    }),
    penumbra: Component_1.types.Percent("Light.Penumbra", 0.5),
};
exports.default = CSpotLight;
//# sourceMappingURL=CSpotLight.js.map