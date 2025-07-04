/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { SpotLight, Object3D } from "three";
import { Node } from "@ff/graph/Component";
import CLight from "./CLight";
export default class CSpotLight extends CLight {
    static readonly typeName: string;
    protected static readonly spotLightIns: {
        position: any;
        target: any;
        distance: any;
        decay: any;
        angle: any;
        penumbra: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    get light(): SpotLight;
    update(context: any): boolean;
    protected onAddToParent(parent: Object3D): void;
    protected onRemoveFromParent(parent: Object3D): void;
}
