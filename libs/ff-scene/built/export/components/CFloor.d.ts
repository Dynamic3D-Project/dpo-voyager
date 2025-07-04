/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import CObject3D, { Node } from "./CObject3D";
import Floor from "@ff/three/Floor";
export default class CFloor extends CObject3D {
    static readonly typeName: string;
    protected static readonly floorIns: {
        position: any;
        radius: any;
        color: any;
        opacity: any;
        castShadow: any;
        receiveShadow: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    protected get floor(): Floor;
    update(context: any): boolean;
    dispose(): void;
}
