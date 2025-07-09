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
class CSunLight extends CLight_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CSunLight.sunLightIns);
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
        // Apply physical lighting adjustment factor similar to CDirectionalLight
        if (ins.color.changed || ins.intensity.changed) {
            light.intensity = ins.intensity.value * Math.PI; //TODO: Remove PI factor when we can support physically correct lighting units
        }
        // Calculate sun position based on azimuth and altitude
        if (ins.horizon.changed || ins.azimuth.changed || ins.altitude.changed) {
            this.updateSunPosition();
        }
        // Handle shadow size updates
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
    /**
     * Updates the sun's position and direction based on horizon, azimuth, and altitude values.
     * Converts astronomical coordinates to 3D scene coordinates.
     */
    updateSunPosition() {
        const light = this.light;
        const ins = this.ins;
        // Convert degrees to radians
        const azimuthRad = (ins.azimuth.value * Math.PI) / 180;
        const altitudeRad = (ins.altitude.value * Math.PI) / 180;
        const horizonRad = (ins.horizon.value * Math.PI) / 180;
        // Calculate sun direction vector
        // In solar coordinates: azimuth is measured from north (0°) clockwise
        // altitude is the angle above the horizon
        const sunDistance = 1000; // Distance doesn't matter for directional light, but we need a position
        // Calculate sun position in world coordinates
        // X axis: East-West (positive = East)
        // Y axis: Up-Down (positive = Up)  
        // Z axis: North-South (positive = North)
        const x = sunDistance * Math.cos(altitudeRad) * Math.sin(azimuthRad);
        const y = sunDistance * Math.sin(altitudeRad) * Math.cos(horizonRad);
        const z = sunDistance * Math.cos(altitudeRad) * Math.cos(azimuthRad);
        // Set light position (sun location)
        light.position.set(x, y, z);
        // Target is always at origin (0,0,0) for sun lighting
        light.target.position.set(0, 0, 0);
        // Update matrices
        light.updateMatrix();
        light.target.updateMatrix();
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
CSunLight.typeName = "CSunLight";
CSunLight.sunLightIns = {
    horizon: Component_1.types.Number("Sun.Horizon", {
        preset: 0,
        min: -90,
        max: 90,
        step: 0.1,
    }),
    azimuth: Component_1.types.Number("Sun.Azimuth", {
        preset: 180,
        min: 0,
        max: 360,
        step: 0.1,
    }),
    altitude: Component_1.types.Number("Sun.Altitude", {
        preset: 45,
        min: 0,
        max: 90,
        step: 0.1,
    }),
    shadowSize: Component_1.types.Number("Shadow.Size", {
        preset: 100,
        min: 0,
    }),
};
exports.default = CSunLight;
//# sourceMappingURL=CSunLight.js.map