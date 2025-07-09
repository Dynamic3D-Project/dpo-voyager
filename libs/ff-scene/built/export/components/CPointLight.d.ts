/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { PointLight } from "three";
import { Node } from "@ff/graph/Component";
import CLight from "./CLight";
export default class CPointLight extends CLight {
    static readonly typeName: string;
    protected static readonly pointLightIns: {
        position: any;
        distance: any;
        decay: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    get light(): PointLight;
    update(context: any): boolean;
}
