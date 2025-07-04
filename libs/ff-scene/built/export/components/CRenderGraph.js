"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.Node = void 0;
const three_1 = require("three");
const CGraph_1 = require("@ff/graph/components/CGraph");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return CGraph_1.Node; } });
Object.defineProperty(exports, "types", { enumerable: true, get: function () { return CGraph_1.types; } });
const CTransform_1 = require("./CTransform");
const CScene_1 = require("./CScene");
class CRenderGraph extends CGraph_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CRenderGraph.rgIns);
        this._object3D = null;
        this._isAttached = false;
        this._object3D = new three_1.Object3D();
        this._object3D.matrixAutoUpdate = false;
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
    create() {
        super.create();
        // add existing inner root transforms
        this.innerRoots
            .filter(root => root.is(CTransform_1.default))
            .forEach((root) => this._object3D.add(root.object3D));
        // track transform component
        this.trackComponent(CTransform_1.default, component => this.ins.visible.value && this.attachObject3D(component), component => this.detachObject3D(component));
    }
    dispose() {
        this.detachObject3D(this.transform);
        // remove all inner root transforms
        this.innerRoots
            .filter(root => root.is(CTransform_1.default))
            .forEach((root) => this._object3D.remove(root.object3D));
        super.dispose();
    }
    update(context) {
        super.update(context);
        const ins = this.ins;
        if (ins.visible.changed) {
            const parent = this.transform;
            if (ins.visible.value) {
                this.attachObject3D(parent);
            }
            else {
                this.detachObject3D(parent);
            }
        }
        return true;
    }
    onAddInnerRoot(component) {
        if (component.is(CTransform_1.default)) {
            this._object3D.add(component.object3D);
        }
    }
    onRemoveInnerRoot(component) {
        if (component.is(CTransform_1.default)) {
            this._object3D.remove(component.object3D);
        }
    }
    attachObject3D(parent) {
        if (this._isAttached) {
            return;
        }
        if (parent) {
            parent.object3D.add(this._object3D);
            this._isAttached = true;
        }
    }
    detachObject3D(parent) {
        if (!this._isAttached) {
            return;
        }
        if (parent) {
            parent.object3D.remove(this._object3D);
            this._isAttached = false;
        }
    }
}
CRenderGraph.typeName = "CRenderGraph";
CRenderGraph.rgIns = {
    visible: CGraph_1.types.Boolean("Graph.Visible", true),
};
exports.default = CRenderGraph;
//# sourceMappingURL=CRenderGraph.js.map