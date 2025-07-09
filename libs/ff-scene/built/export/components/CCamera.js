"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EProjection = void 0;
const three_1 = require("three");
const Component_1 = require("@ff/graph/Component");
const UniversalCamera_1 = require("@ff/three/UniversalCamera");
Object.defineProperty(exports, "EProjection", { enumerable: true, get: function () { return UniversalCamera_1.EProjection; } });
const CObject3D_1 = require("./CObject3D");
const math_1 = require("@ff/core/math");
////////////////////////////////////////////////////////////////////////////////
const _vec3a = new three_1.Vector3();
const _vec3b = new three_1.Vector3();
const _euler = new three_1.Euler();
const _quat = new three_1.Quaternion();
class CCamera extends CObject3D_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CCamera.camIns);
        this.object3D = new UniversalCamera_1.default();
    }
    /**
     * Returns the internal [[UniversalCamera]] camera object of this component.
     */
    get camera() {
        return this.object3D;
    }
    update() {
        const { autoActivate, activate } = this.ins;
        // set the camera as active in the containing scene
        if (activate.changed || autoActivate.changed && autoActivate.value) {
            const scene = this.scene;
            if (scene) {
                scene.activeCameraComponent = this;
            }
        }
        const camera = this.camera;
        const { position, rotation, projection, fov, size, zoom, near, far } = this.ins;
        if (position.changed || rotation.changed) {
            camera.position.fromArray(position.value);
            const rot = [rotation.value[0], rotation.value[1], rotation.value[2]];
            camera.rotation.fromArray(rot);
            camera.updateMatrix();
        }
        if (projection.changed) {
            camera.setProjection(projection.getValidatedValue());
        }
        camera.fov = fov.value;
        camera.size = size.value;
        camera.zoom = zoom.value;
        camera.near = near.value;
        camera.far = far.value;
        camera.updateProjectionMatrix();
        return true;
    }
    dispose() {
        const scene = this.scene;
        if (scene && scene.activeCameraComponent === this) {
            scene.activeCameraComponent = null;
        }
        super.dispose();
    }
    /**
     * Sets the position, rotation, and order properties from the given 4x4 transform matrix.
     * Updating the properties then also updates the matrix of the internal universal camera object.
     * @param matrix A 4x4 transform matrix. If omitted, properties are updated from the matrix of the internal camera.
     */
    setPropertiesFromMatrix(matrix) {
        const silent = !matrix;
        matrix = matrix || this.object3D.matrix;
        const { position, rotation, order } = this.ins;
        matrix.decompose(_vec3a, _quat, _vec3b);
        _vec3a.toArray(position.value);
        const orderName = order.getOptionText();
        _euler.setFromQuaternion(_quat, orderName);
        _vec3a.setFromEuler(_euler);
        _vec3a.multiplyScalar(math_1.default.RAD2DEG).toArray(rotation.value);
        position.set(silent);
        rotation.set(silent);
    }
}
CCamera.typeName = "CCamera";
CCamera.camIns = {
    autoActivate: Component_1.types.Boolean("Camera.AutoActivate", true),
    activate: Component_1.types.Event("Camera.Activate"),
    position: Component_1.types.Vector3("Transform.Position"),
    rotation: Component_1.types.Vector3("Transform.Rotation"),
    order: Component_1.types.Enum("Transform.Order", CObject3D_1.ERotationOrder, CObject3D_1.ERotationOrder.ZYX),
    projection: Component_1.types.Enum("Projection.Type", UniversalCamera_1.EProjection, UniversalCamera_1.EProjection.Perspective),
    fov: Component_1.types.Number("Projection.FovY", 52),
    size: Component_1.types.Number("Projection.Size", 20),
    zoom: Component_1.types.Number("Projection.Zoom", 1),
    near: Component_1.types.Number("Frustum.ZNear", 0.01),
    far: Component_1.types.Number("Frustum.ZFar", 10000),
};
exports.default = CCamera;
//# sourceMappingURL=CCamera.js.map