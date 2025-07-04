/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import CObject3D, { Node } from "./CObject3D";
import Background, { EBackgroundStyle } from "@ff/three/Background";
export { EBackgroundStyle };
export default class CBackground extends CObject3D {
    static readonly typeName: string;
    protected static readonly backgroundIns: {
        style: any;
        color0: any;
        color1: any;
        noise: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    protected get background(): Background;
    update(context: any): boolean;
    dispose(): void;
}
