/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Object3D, DirectionalLight } from "three";
import { Node } from "@ff/graph/Component";
import CLight from "./CLight";
export default class CDirectionalLight extends CLight {
    static readonly typeName: string;
    protected static readonly dirLightIns: {
        position: any;
        target: any;
        shadowSize: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    get light(): DirectionalLight;
    update(context: any): boolean;
    protected onAddToParent(parent: Object3D): void;
    protected onRemoveFromParent(parent: Object3D): void;
}
