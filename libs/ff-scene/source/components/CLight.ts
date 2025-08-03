/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Light } from "three";

import { Node, types } from "@ff/graph/Component";
import CObject3D from "./CObject3D";

////////////////////////////////////////////////////////////////////////////////

export enum EShadowMapResolution { Low, Medium, High }
export enum ELightType {
    directional,
    point,
    spot,
    ambient,
    hemisphere,
    rect,
}   // copy from CVLight.ts

const _mapResolution = {
    [EShadowMapResolution.Low]: 512,
    [EShadowMapResolution.Medium]: 1024,
    [EShadowMapResolution.High]: 2048,
};

export default class CLight extends CObject3D
{
    static readonly typeName: string = "CLight";
    static readonly type = null;

    protected static readonly lightIns = {
        color: types.ColorRGB("Light.Color"),
        intensity: types.Number("Light.Intensity", {
            preset:1,
            min: 0,
        }),
        shadowEnabled: types.Boolean("Shadow.Enabled"),
        shadowResolution: types.Enum("Shadow.Resolution", EShadowMapResolution, EShadowMapResolution.Medium),
        shadowBlur: types.Number("Shadow.Blur", 1),
        lightType: types.Enum("Light.Type", ELightType, ELightType.directional), // TODO read default type value from class instance
        // lightType: types.String("Light.Type")
    };

    ins = this.addInputs<CObject3D, typeof CLight["lightIns"]>(CLight.lightIns);

    get light(): Light
    {
        return this.object3D as Light;
    }

    update(context)
    {
        super.update(context);

        const light = this.light;
        const ins = this.ins;

        // FIXME: light properties are not set for newLight
        // if (ins.lightType.changed) {
        //     let newType = ELightType[ins.lightType.value];        

        //     console.debug(`Updating light: ${this.id}`);

        //     let lightManager = this.system.getMainComponent("CVLightManager") as any;
        //     let newLight = lightManager.changeLightType(this, newType);
        //     if (newLight === this) {
        //         console.log("Light unchanged.");
        //     } else {
        //         console.log(`Light type changed to '${newType}'.`);                
        //     }
        // }

        if (ins.color.changed || ins.intensity.changed) {
            light.color.fromArray(ins.color.value);
            light.intensity = ins.intensity.value;
        }

        //some lights, like ambient and hemisphere light don't have shadows
        if("shadow" in light){
            if (ins.shadowEnabled.changed) {
                light.castShadow = ins.shadowEnabled.value;
            }

            if(ins.shadowBlur.changed){
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

    isTypeOf(otherType: String): boolean {
        return this.typeName.toLowerCase().includes(otherType.toLowerCase());
    }
}