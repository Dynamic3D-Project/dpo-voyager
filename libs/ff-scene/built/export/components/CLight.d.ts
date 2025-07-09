/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Light } from "three";
import CObject3D from "./CObject3D";
export declare enum EShadowMapResolution {
    Low = 0,
    Medium = 1,
    High = 2
}
export default class CLight extends CObject3D {
    static readonly typeName: string;
    protected static readonly lightIns: {
        color: any;
        intensity: any;
        shadowEnabled: any;
        shadowResolution: any;
        shadowBlur: any;
    };
    ins: any;
    get light(): Light;
    update(context: any): boolean;
}
