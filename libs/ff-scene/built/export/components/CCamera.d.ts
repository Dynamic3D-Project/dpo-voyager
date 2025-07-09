/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Matrix4 } from "three";
import { Node } from "@ff/graph/Component";
import UniversalCamera, { EProjection } from "@ff/three/UniversalCamera";
import CObject3D from "./CObject3D";
export { EProjection };
export default class CCamera extends CObject3D {
    static readonly typeName: string;
    protected static readonly camIns: {
        autoActivate: any;
        activate: any;
        position: any;
        rotation: any;
        order: any;
        projection: any;
        fov: any;
        size: any;
        zoom: any;
        near: any;
        far: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    /**
     * Returns the internal [[UniversalCamera]] camera object of this component.
     */
    get camera(): UniversalCamera;
    update(): boolean;
    dispose(): void;
    /**
     * Sets the position, rotation, and order properties from the given 4x4 transform matrix.
     * Updating the properties then also updates the matrix of the internal universal camera object.
     * @param matrix A 4x4 transform matrix. If omitted, properties are updated from the matrix of the internal camera.
     */
    setPropertiesFromMatrix(matrix?: Matrix4): void;
}
