/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Object3D, DirectionalLight } from "three";

import { Node, types } from "@ff/graph/Component";

import CLight from "./CLight";

////////////////////////////////////////////////////////////////////////////////

export default class CSunLight extends CLight
{
    static readonly typeName: string = "CSunLight";

    protected static readonly sunLightIns = {
        horizon: types.Number("Sun.Horizon", {
            preset: 0,
            min: -90,
            max: 90,
            step: 0.1,
        }),
        azimuth: types.Number("Sun.Azimuth", {
            preset: 180,
            min: 0,
            max: 360,
            step: 0.1,
        }),
        altitude: types.Number("Sun.Altitude", {
            preset: 45,
            min: 0,
            max: 90,
            step: 0.1,
        }),
        shadowSize: types.Number("Shadow.Size", {
            preset: 100,
            min: 0,
        }),
    };

    ins = this.addInputs<CLight, typeof CSunLight["sunLightIns"]>(CSunLight.sunLightIns);

    constructor(node: Node, id: string)
    {
        super(node, id);

        this.object3D = new DirectionalLight();
        this.light.target.matrixAutoUpdate = false;
    }

    get light(): DirectionalLight {
        return this.object3D as DirectionalLight;
    }

    update(context)
    {
        super.update(context);

        const light = this.light;
        const ins = this.ins;

        // Apply physical lighting adjustment factor similar to CDirectionalLight
        if (ins.color.changed || ins.intensity.changed) {
            light.intensity = ins.intensity.value * Math.PI;  //TODO: Remove PI factor when we can support physically correct lighting units
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
    protected updateSunPosition()
    {
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

    protected onAddToParent(parent: Object3D)
    {
        super.onAddToParent(parent);
        parent.add(this.light.target);
    }

    protected onRemoveFromParent(parent: Object3D)
    {
        super.onRemoveFromParent(parent);
        parent.remove(this.light.target);
    }
}