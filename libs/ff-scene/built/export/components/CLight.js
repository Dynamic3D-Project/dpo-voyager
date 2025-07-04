"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EShadowMapResolution = void 0;
const Component_1 = require("@ff/graph/Component");
const CObject3D_1 = require("./CObject3D");
////////////////////////////////////////////////////////////////////////////////
var EShadowMapResolution;
(function (EShadowMapResolution) {
    EShadowMapResolution[EShadowMapResolution["Low"] = 0] = "Low";
    EShadowMapResolution[EShadowMapResolution["Medium"] = 1] = "Medium";
    EShadowMapResolution[EShadowMapResolution["High"] = 2] = "High";
})(EShadowMapResolution || (exports.EShadowMapResolution = EShadowMapResolution = {}));
const _mapResolution = {
    [EShadowMapResolution.Low]: 512,
    [EShadowMapResolution.Medium]: 1024,
    [EShadowMapResolution.High]: 2048,
};
class CLight extends CObject3D_1.default {
    constructor() {
        super(...arguments);
        this.ins = this.addInputs(CLight.lightIns);
    }
    get light() {
        return this.object3D;
    }
    update(context) {
        super.update(context);
        const light = this.light;
        const ins = this.ins;
        if (ins.color.changed || ins.intensity.changed) {
            light.color.fromArray(ins.color.value);
            light.intensity = ins.intensity.value;
        }
        //some lights, like ambient and hemisphere light don't have shadows
        if ("shadow" in light) {
            if (ins.shadowEnabled.changed) {
                light.castShadow = ins.shadowEnabled.value;
            }
            if (ins.shadowBlur.changed) {
                light.shadow.radius = ins.shadowBlur.value;
            }
            if (ins.shadowResolution.changed) {
                const mapResolution = _mapResolution[ins.shadowResolution.getValidatedValue()];
                light.shadow.mapSize.set(mapResolution, mapResolution);
                light.shadow.map = null; // TODO: check for resource leak
            }
        }
        return true;
    }
}
CLight.typeName = "CLight";
CLight.lightIns = {
    color: Component_1.types.ColorRGB("Light.Color"),
    intensity: Component_1.types.Number("Light.Intensity", {
        preset: 1,
        min: 0,
    }),
    shadowEnabled: Component_1.types.Boolean("Shadow.Enabled"),
    shadowResolution: Component_1.types.Enum("Shadow.Resolution", EShadowMapResolution, EShadowMapResolution.Medium),
    shadowBlur: Component_1.types.Number("Shadow.Blur", 1),
};
exports.default = CLight;
//# sourceMappingURL=CLight.js.map