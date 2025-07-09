import { HemisphereLight } from "three";
import { Node } from "@ff/graph/Component";
import CLight from "./CLight";
/**
 * Implementeation of [HemisphereLight](https://threejs.org/docs/?q=HemisphereLight#api/en/lights/HemisphereLight) from three.js
 * It does NOT work on Standard materials that have a metallic value of 1
 */
export default class CHemisphereLight extends CLight {
    static readonly typeName: string;
    protected static readonly hemiLightIns: {
        ground: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    get light(): HemisphereLight;
    update(context: any): boolean;
}
