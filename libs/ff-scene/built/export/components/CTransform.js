"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERotationOrder = exports.types = void 0;
const three_1 = require("three");
const math_1 = require("@ff/core/math");
const Component_1 = require("@ff/graph/Component");
Object.defineProperty(exports, "types", { enumerable: true, get: function () { return Component_1.types; } });
const CHierarchy_1 = require("@ff/graph/components/CHierarchy");
////////////////////////////////////////////////////////////////////////////////
const _vec3a = new three_1.Vector3();
const _vec3b = new three_1.Vector3();
const _quat = new three_1.Quaternion();
const _euler = new three_1.Euler();
var ERotationOrder;
(function (ERotationOrder) {
    ERotationOrder[ERotationOrder["XYZ"] = 0] = "XYZ";
    ERotationOrder[ERotationOrder["YZX"] = 1] = "YZX";
    ERotationOrder[ERotationOrder["ZXY"] = 2] = "ZXY";
    ERotationOrder[ERotationOrder["XZY"] = 3] = "XZY";
    ERotationOrder[ERotationOrder["YXZ"] = 4] = "YXZ";
    ERotationOrder[ERotationOrder["ZYX"] = 5] = "ZYX";
})(ERotationOrder || (exports.ERotationOrder = ERotationOrder = {}));
/**
 * Allows arranging components in a hierarchical structure. Each [[TransformComponent]]
 * contains a transformation which affects its children as well as other components which
 * are part of the same entity.
 */
class CTransform extends CHierarchy_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CTransform.transformIns);
        this.outs = this.addOutputs(CTransform.transformOuts);
        this._object3D = this.createObject3D();
        this._object3D.matrixAutoUpdate = false;
    }
    get transform() {
        return this;
    }
    /**
     * Returns the three.js renderable object wrapped in this component.
     */
    get object3D() {
        return this._object3D;
    }
    /**
     * Returns an array of child components of this.
     */
    get children() {
        return this._children || [];
    }
    /**
     * Returns a reference to the local transformation matrix.
     */
    get matrix() {
        return this._object3D.matrix;
    }
    update(context) {
        const object3D = this._object3D;
        const { position, rotation, order, scale } = this.ins;
        const { matrix } = this.outs;
        object3D.position.fromArray(position.value);
        _vec3a.fromArray(rotation.value).multiplyScalar(math_1.default.DEG2RAD);
        const orderName = order.getOptionText();
        object3D.rotation.setFromVector3(_vec3a, orderName);
        object3D.scale.fromArray(scale.value);
        object3D.updateMatrix();
        object3D.matrix.toArray(matrix.value);
        matrix.set();
        return true;
    }
    dispose() {
        if (this._object3D) {
            // detach all children
            this._object3D.children.slice().forEach(child => this._object3D.remove(child));
            // detach from parent
            if (this._object3D.parent) {
                this._object3D.parent.remove(this._object3D);
            }
        }
        super.dispose();
    }
    setPropertiesFromMatrix(matrix) {
        const silent = !matrix;
        matrix = matrix || this._object3D.matrix;
        const { position, rotation, order, scale } = this.ins;
        matrix.decompose(_vec3a, _quat, _vec3b);
        _vec3a.toArray(position.value);
        const orderName = order.getOptionText();
        _euler.setFromQuaternion(_quat, orderName);
        _vec3a.setFromEuler(_euler);
        _vec3a.multiplyScalar(math_1.default.RAD2DEG).toArray(rotation.value);
        _vec3b.toArray(scale.value);
        position.set(silent);
        rotation.set(silent);
        scale.set(silent);
    }
    /**
     * Adds the given transform component as a children to this.
     * @param component
     */
    addChild(component) {
        super.addChild(component);
        this._object3D.add(component._object3D);
    }
    /**
     * Removes the given transform component from the list of children of this.
     * @param component
     */
    removeChild(component) {
        this._object3D.remove(component._object3D);
        super.removeChild(component);
    }
    createObject3D() {
        return new three_1.Object3D();
    }
}
CTransform.typeName = "CTransform";
CTransform.transformIns = {
    position: Component_1.types.Vector3("Transform.Position"),
    rotation: Component_1.types.Vector3("Transform.Rotation"),
    order: Component_1.types.Enum("Transform.Order", ERotationOrder),
    scale: Component_1.types.Scale3("Transform.Scale")
};
CTransform.transformOuts = {
    matrix: Component_1.types.Matrix4("Transform.Matrix")
};
exports.default = CTransform;
//# sourceMappingURL=CTransform.js.map