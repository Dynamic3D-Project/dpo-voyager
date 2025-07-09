/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Object3D, Matrix4 } from "three";
import Component, { Node, types } from "@ff/graph/Component";
import CHierarchy from "@ff/graph/components/CHierarchy";
export { types };
export declare enum ERotationOrder {
    XYZ = 0,
    YZX = 1,
    ZXY = 2,
    XZY = 3,
    YXZ = 4,
    ZYX = 5
}
export interface ICObject3D extends Component {
    object3D: Object3D;
}
/**
 * Allows arranging components in a hierarchical structure. Each [[TransformComponent]]
 * contains a transformation which affects its children as well as other components which
 * are part of the same entity.
 */
export default class CTransform extends CHierarchy implements ICObject3D {
    static readonly typeName: string;
    static readonly transformIns: {
        position: any;
        rotation: any;
        order: any;
        scale: any;
    };
    static readonly transformOuts: {
        matrix: any;
    };
    ins: any;
    outs: any;
    private _object3D;
    constructor(node: Node, id: string);
    get transform(): CTransform;
    /**
     * Returns the three.js renderable object wrapped in this component.
     */
    get object3D(): Object3D;
    /**
     * Returns an array of child components of this.
     */
    get children(): Readonly<CTransform[]>;
    /**
     * Returns a reference to the local transformation matrix.
     */
    get matrix(): Readonly<Matrix4>;
    update(context: any): boolean;
    dispose(): void;
    setPropertiesFromMatrix(matrix?: Matrix4): void;
    /**
     * Adds the given transform component as a children to this.
     * @param component
     */
    addChild(component: CTransform): void;
    /**
     * Removes the given transform component from the list of children of this.
     * @param component
     */
    removeChild(component: CTransform): void;
    protected createObject3D(): any;
}
