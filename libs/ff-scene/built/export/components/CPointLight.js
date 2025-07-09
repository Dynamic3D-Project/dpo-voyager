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
const _vec3 = new three_1.Vector3();
class CPointLight extends CLight_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CPointLight.pointLightIns);
        this.object3D = new three_1.PointLight();
    }
    get light() {
        return this.object3D;
    }
    update(context) {
        super.update(context);
        const light = this.light;
        const ins = this.ins;
        if (ins.position.changed) {
            light.position.fromArray(ins.position.value);
            light.updateMatrix();
        }
        if (ins.distance.changed || ins.decay.changed) {
            light.distance = ins.distance.value;
            light.decay = ins.decay.value;
            //PointLightShadow doesn't handle camera.near for us, but will set camera.far and update the projection matrix
            light.shadow.camera.near = light.distance ? light.distance / 800 : 0.5;
        }
        light.updateMatrix();
        return true;
    }
}
CPointLight.typeName = "CPointLight";
CPointLight.pointLightIns = {
    position: Component_1.types.Vector3("Light.Position"),
    distance: Component_1.types.Number("Light.Distance"),
    decay: Component_1.types.Number("Light.Decay", 1),
};
exports.default = CPointLight;
//# sourceMappingURL=CPointLight.js.map