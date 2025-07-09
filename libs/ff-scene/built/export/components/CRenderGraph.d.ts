/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Object3D } from "three";
import CGraph, { Node, types } from "@ff/graph/components/CGraph";
import CHierarchy from "@ff/graph/components/CHierarchy";
import { ICObject3D } from "./CObject3D";
import CTransform from "./CTransform";
import CScene from "./CScene";
export { Node, types };
export default class CRenderGraph extends CGraph implements ICObject3D {
    static readonly typeName: string;
    protected static readonly rgIns: {
        visible: any;
    };
    ins: any;
    private _object3D;
    private _isAttached;
    constructor(node: Node, id: string);
    /** The component node's transform component. */
    get transform(): CTransform | undefined;
    /** The scene this renderable object is part of. */
    get scene(): CScene | undefined;
    /** The underlying [[Object3D]] of this component. */
    get object3D(): Object3D | null;
    create(): void;
    dispose(): void;
    update(context: any): boolean;
    onAddInnerRoot(component: CHierarchy): void;
    onRemoveInnerRoot(component: CHierarchy): void;
    protected attachObject3D(parent: CTransform): void;
    protected detachObject3D(parent: CTransform): void;
}
