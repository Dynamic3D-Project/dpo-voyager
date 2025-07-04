"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERotationOrder = exports.types = exports.Node = void 0;
const three_1 = require("three");
const Component_1 = require("@ff/graph/Component");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return Component_1.Node; } });
Object.defineProperty(exports, "types", { enumerable: true, get: function () { return Component_1.types; } });
const GPUPicker_1 = require("@ff/three/GPUPicker");
const CScene_1 = require("./CScene");
const CTransform_1 = require("./CTransform");
Object.defineProperty(exports, "ERotationOrder", { enumerable: true, get: function () { return CTransform_1.ERotationOrder; } });
////////////////////////////////////////////////////////////////////////////////
const _vec3 = new three_1.Vector3();
/**
 * Base class for drawable components. Wraps a Object3D based instance.
 * If component is added to a node together with a [[Transform]] component,
 * it is automatically added as a child to the transform.
 */
class CObject3D extends Component_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CObject3D.object3DIns);
        this.outs = this.addOutputs(CObject3D.object3DOuts);
        this._object3D = null;
        this._isPickable = false;
        this.addEvent("object");
        this.node.components.on(this.parentComponentClass, this._onParent, this);
    }
    /** The class of a component in the same node this component uses as parent transform. */
    get parentComponentClass() {
        return this.constructor.parentComponentClass;
    }
    /** The transform parent of this object. */
    get parentComponent() {
        return this.node.components.get(this.parentComponentClass, true);
    }
    /** The component node's transform component. */
    get transform() {
        return this.node.components.get(CTransform_1.default, true);
    }
    /** The scene this renderable object is part of. */
    get scene() {
        const transform = this.transform;
        return transform ? transform.getParentComponent(CScene_1.default, true) : undefined;
    }
    /** The underlying [[Object3D]] of this component. */
    get object3D() {
        return this._object3D;
    }
    /**
     * Assigns a [[Object3D]] to this component. The object automatically becomes a child
     * of the parent component's object.
     * @param object
     */
    set object3D(object) {
        const currentObject = this._object3D;
        if (currentObject) {
            currentObject.userData["component"] = null;
            this.unregisterPickableObject3D(currentObject, true);
            if (currentObject.parent) {
                this.onRemoveFromParent(currentObject.parent);
            }
        }
        this.emit({ type: "object", current: currentObject, next: object });
        this._object3D = object;
        if (object) {
            object.userData["component"] = this;
            object.matrixAutoUpdate = false;
            object.visible = this.ins.visible.value;
            this.registerPickableObject3D(object, true);
            const parentComponent = this.parentComponent;
            if (parentComponent) {
                this.onAddToParent(parentComponent.object3D);
            }
        }
    }
    update(context) {
        const { visible, pickable } = this.ins;
        if (visible.changed && this._object3D) {
            this._object3D.visible = visible.value;
        }
        if (pickable.changed && pickable.value !== this._isPickable) {
            this._isPickable = pickable.value;
            if (pickable.value) {
                this.enablePointerEvents();
            }
            else {
                this.disablePointerEvents();
            }
        }
        return true;
    }
    dispose() {
        this.object3D = null;
        if (this.ins.pickable.value) {
            this.disablePointerEvents();
        }
        this.node.components.off(this.parentComponentClass, this._onParent, this);
        super.dispose();
    }
    /**
     * This is called right before the graph's scene is rendered to a specific viewport/view.
     * Override to make adjustments specific to the renderer, view or viewport.
     * @param context
     */
    preRender(context) {
    }
    /**
     * This is called right after the graph's scene has been rendered to a specific viewport/view.
     * Override to make adjustments specific to the renderer, view or viewport.
     * @param context
     */
    postRender(context) {
    }
    /**
     * Returns a text representation.
     */
    toString() {
        return super.toString() + (this._object3D ? ` - type: ${this._object3D.type}` : " - (null)");
    }
    onPointer(event) {
        const outs = this.outs;
        if (event.type === "pointer-down") {
            outs.pointerDown.set();
            outs.pointerActive.setValue(true);
        }
        else if (event.type === "pointer-up") {
            outs.pointerUp.set();
            outs.pointerActive.setValue(false);
        }
        event.stopPropagation = true;
    }
    enablePointerEvents() {
        this.on("pointer-down", this.onPointer, this);
        this.on("pointer-up", this.onPointer, this);
    }
    disablePointerEvents() {
        this.off("pointer-down", this.onPointer, this);
        this.off("pointer-up", this.onPointer, this);
        const outs = this.outs;
        if (outs.pointerActive.value) {
            outs.pointerUp.set();
            outs.pointerActive.setValue(false);
        }
    }
    updateTransform() {
        const object3D = this._object3D;
        if (!object3D) {
            return;
        }
        const { position, rotation, order, scale } = this.ins;
        if (position.changed || rotation.changed || order.changed || scale.changed) {
            // update position
            object3D.position.fromArray(position.value);
            // update rotation angles, rotation order
            _vec3.fromArray(rotation.value).multiplyScalar(three_1.MathUtils.DEG2RAD);
            const orderName = order.getOptionText();
            object3D.rotation.setFromVector3(_vec3, orderName);
            // update scale
            object3D.scale.fromArray(scale.value);
            // compose matrix
            object3D.updateMatrix();
        }
        return true;
    }
    onAddToParent(parent) {
        parent.add(this._object3D);
    }
    onRemoveFromParent(parent) {
        parent.remove(this._object3D);
    }
    /**
     * Adds a [[Object3D]] as a child to this component's object.
     * Registers the object with the picking service to make it pickable.
     * @param object
     */
    addObject3D(object) {
        this._object3D.add(object);
        this.registerPickableObject3D(object, true);
    }
    /**
     * Removes a [[Object3D]] child from this component's object.
     * Also unregisters the object from the picking service.
     * @param object
     */
    removeObject3D(object) {
        this.unregisterPickableObject3D(object, true);
        this._object3D.remove(object);
    }
    /**
     * This should be called after an external change to this component's Object3D subtree.
     * It registers newly added mesh objects with the picking service.
     * @param object
     * @param recursive
     */
    registerPickableObject3D(object, recursive) {
        GPUPicker_1.default.add(object, recursive);
    }
    /**
     * This should be called before an external change to this component's Object3D subtree.
     * It unregisters the mesh objects in the subtree from the picking service.
     * @param object
     * @param recursive
     */
    unregisterPickableObject3D(object, recursive) {
        GPUPicker_1.default.remove(object, recursive);
    }
    _onParent(event) {
        // add this Object3D to the parent Object3D
        if (this._object3D && !this._object3D.parent && event.add) {
            this.onAddToParent(event.object.object3D);
        }
    }
}
CObject3D.typeName = "CObject3D";
/** The component type whose object3D is the parent of this component's object3D. */
CObject3D.parentComponentClass = CTransform_1.default;
CObject3D.object3DIns = {
    visible: Component_1.types.Boolean("Object.Visible", true),
    pickable: Component_1.types.Boolean("Object.Pickable"),
};
CObject3D.object3DOuts = {
    pointerDown: Component_1.types.Event("Pointer.Down"),
    pointerUp: Component_1.types.Event("Pointer.Up"),
    pointerActive: Component_1.types.Boolean("Pointer.Active")
};
CObject3D.transformIns = CTransform_1.default.transformIns;
exports.default = CObject3D;
CObject3D.prototype.preRender = null;
CObject3D.prototype.postRender = null;
//# sourceMappingURL=CObject3D.js.map