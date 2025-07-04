/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Object3D } from "three";
import { TypeOf } from "@ff/core/types";
import { ITypedEvent } from "@ff/core/Publisher";
import Component, { Node, types } from "@ff/graph/Component";
import { IPointerEvent, ITriggerEvent } from "../RenderView";
import CScene, { IRenderContext } from "./CScene";
import CTransform, { ERotationOrder } from "./CTransform";
export { Node, types, IPointerEvent, ITriggerEvent, IRenderContext, ERotationOrder };
export interface ICObject3D extends Component {
    object3D: Object3D;
}
export interface IObject3DObjectEvent extends ITypedEvent<"object"> {
    current: Object3D;
    next: Object3D;
}
/**
 * Base class for drawable components. Wraps a Object3D based instance.
 * If component is added to a node together with a [[Transform]] component,
 * it is automatically added as a child to the transform.
 */
export default class CObject3D extends Component implements ICObject3D {
    static readonly typeName: string;
    /** The component type whose object3D is the parent of this component's object3D. */
    protected static readonly parentComponentClass: TypeOf<ICObject3D>;
    static readonly object3DIns: {
        visible: any;
        pickable: any;
    };
    static readonly object3DOuts: {
        pointerDown: any;
        pointerUp: any;
        pointerActive: any;
    };
    static readonly transformIns: {
        position: any;
        rotation: any;
        order: any;
        scale: any;
    };
    ins: any;
    outs: any;
    private _object3D;
    private _isPickable;
    constructor(node: Node, id: string);
    /** The class of a component in the same node this component uses as parent transform. */
    get parentComponentClass(): TypeOf<ICObject3D>;
    /** The transform parent of this object. */
    get parentComponent(): ICObject3D | undefined;
    /** The component node's transform component. */
    get transform(): CTransform | undefined;
    /** The scene this renderable object is part of. */
    get scene(): CScene | undefined;
    /** The underlying [[Object3D]] of this component. */
    get object3D(): Object3D | null;
    /**
     * Assigns a [[Object3D]] to this component. The object automatically becomes a child
     * of the parent component's object.
     * @param object
     */
    set object3D(object: Object3D);
    update(context: any): boolean;
    dispose(): void;
    /**
     * This is called right before the graph's scene is rendered to a specific viewport/view.
     * Override to make adjustments specific to the renderer, view or viewport.
     * @param context
     */
    preRender(context: IRenderContext): void;
    /**
     * This is called right after the graph's scene has been rendered to a specific viewport/view.
     * Override to make adjustments specific to the renderer, view or viewport.
     * @param context
     */
    postRender(context: IRenderContext): void;
    /**
     * Returns a text representation.
     */
    toString(): string;
    protected onPointer(event: IPointerEvent): void;
    protected enablePointerEvents(): void;
    protected disablePointerEvents(): void;
    protected updateTransform(): boolean;
    protected onAddToParent(parent: Object3D): void;
    protected onRemoveFromParent(parent: Object3D): void;
    /**
     * Adds a [[Object3D]] as a child to this component's object.
     * Registers the object with the picking service to make it pickable.
     * @param object
     */
    protected addObject3D(object: Object3D): void;
    /**
     * Removes a [[Object3D]] child from this component's object.
     * Also unregisters the object from the picking service.
     * @param object
     */
    protected removeObject3D(object: Object3D): void;
    /**
     * This should be called after an external change to this component's Object3D subtree.
     * It registers newly added mesh objects with the picking service.
     * @param object
     * @param recursive
     */
    protected registerPickableObject3D(object: Object3D, recursive: boolean): void;
    /**
     * This should be called before an external change to this component's Object3D subtree.
     * It unregisters the mesh objects in the subtree from the picking service.
     * @param object
     * @param recursive
     */
    protected unregisterPickableObject3D(object: Object3D, recursive: boolean): void;
    private _onParent;
}
