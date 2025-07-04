import { RectAreaLight } from "three";
import { Node } from "@ff/graph/Component";
import CLight from "./CLight";
export default class CRectLight extends CLight {
    static readonly typeName: string;
    protected static readonly rectLightIns: {
        position: any;
        target: any;
        size: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    get light(): RectAreaLight;
    update(context: any): boolean;
    dispose(): void;
}
