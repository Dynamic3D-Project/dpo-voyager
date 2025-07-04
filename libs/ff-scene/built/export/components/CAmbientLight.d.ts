import { AmbientLight } from "three";
import { Node } from "@ff/graph/Component";
import CLight from "./CLight";
export default class CAmbientLight extends CLight {
    static readonly typeName: string;
    constructor(node: Node, id: string);
    get light(): AmbientLight;
}
