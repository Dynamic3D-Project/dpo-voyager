"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("@ff/graph/Component");
const CSelection_1 = require("@ff/graph/components/CSelection");
const Bracket_1 = require("@ff/three/Bracket");
const Axes_1 = require("@ff/three/Axes");
const SpotLightHelper_1 = require("@ff/three/lights/SpotLightHelper");
const DirectionalLightHelper_1 = require("@ff/three/lights/DirectionalLightHelper");
const PointLightHelper_1 = require("@ff/three/lights/PointLightHelper");
const AmbientLightHelper_1 = require("@ff/three/lights/AmbientLightHelper");
const RectLightHelper_1 = require("@ff/three/lights/RectLightHelper");
const CObject3D_1 = require("./CObject3D");
const CTransform_1 = require("./CTransform");
////////////////////////////////////////////////////////////////////////////////
const helpers = [
    [DirectionalLightHelper_1.default, "DirectionalLight"],
    [PointLightHelper_1.default, "PointLight"],
    [SpotLightHelper_1.default, "SpotLight"],
    [AmbientLightHelper_1.default, "HemisphereLight"],
    [AmbientLightHelper_1.default, "AmbientLight"],
    [RectLightHelper_1.default, "RectAreaLight"],
];
const _inputs = {
    viewportPicking: Component_1.types.Boolean("Viewport.Picking", true),
    viewportBrackets: Component_1.types.Boolean("Viewport.Brackets", true),
};
class CPickSelection extends CSelection_1.default {
    constructor() {
        super(...arguments);
        this.ins = this.addInputs(_inputs);
        this._brackets_map = new Map();
        this._axes_map = new Map();
    }
    create() {
        super.create();
        this.system.on("pointer-up", this.onPointerUp, this);
    }
    dispose() {
        this.system.off("pointer-up", this.onPointerUp, this);
        super.dispose();
    }
    update() {
        if (this.ins.viewportBrackets.changed) {
            for (let bracket of this._brackets_map.values()) {
                bracket.visible = this.ins.viewportBrackets.value;
            }
            for (let axes of this._axes_map.values()) {
                axes.visible = this.ins.viewportBrackets.value;
            }
        }
        return true;
    }
    onSelectNode(node, selected) {
        super.onSelectNode(node, selected);
        const transform = node.typeName === "NVScene" ? node.getComponent(CTransform_1.default, true) : node.getComponent(CObject3D_1.default, true);
        if (transform) {
            this.updateBracket(transform, selected);
        }
    }
    onSelectComponent(component, selected) {
        super.onSelectComponent(component, selected);
        if (component instanceof CObject3D_1.default || component instanceof CTransform_1.default) {
            this.updateBracket(component, selected);
        }
    }
    onPointerUp(event) {
        if (!this.ins.viewportPicking.value || !event.isPrimary || event.isDragging) {
            return;
        }
        if (event.component) {
            this.selectComponent(event.component, event.ctrlKey);
        }
        else if (!event.ctrlKey) {
            this.clearSelection();
        }
    }
    tick(ctx) {
        for (let b of this._brackets_map.values()) {
            b.update();
        }
        return false;
    }
    updateBracket(component, selected) {
        var _a;
        if (!component) {
            return;
        }
        //if(!this.ins.viewportBrackets.value) return; //Don't create brackets to be hidden
        const object3D = component.object3D;
        const transform = component.transform;
        if (selected) {
            if (object3D) {
                let bracket;
                if (object3D.isLight) {
                    let HelperCl = (_a = helpers.find(([h, type]) => type === object3D.type)) === null || _a === void 0 ? void 0 : _a[0];
                    if (HelperCl) {
                        object3D.updateMatrix();
                        bracket = new HelperCl(object3D);
                        /** @bug PointLightHelper doesn't call it internally in  its update() method. */
                        bracket.updateWorldMatrix(true, false);
                    }
                }
                if (!bracket) {
                    bracket = new Bracket_1.default(object3D);
                }
                object3D.add(bracket);
                this._brackets_map.set(component, bracket);
                bracket.visible = this.ins.viewportBrackets.value;
            }
            if (transform && transform.object3D != object3D) {
                let o = new Axes_1.default(transform.object3D);
                this._axes_map.set(transform, o);
                transform.object3D.add(o);
                o.visible = this.ins.viewportBrackets.value;
            }
        }
        else {
            if (object3D) {
                const bracket = this._brackets_map.get(component);
                if (bracket) {
                    this._brackets_map.delete(component);
                    bracket.removeFromParent();
                    bracket.dispose();
                }
            }
            if (transform) {
                const axes = this._axes_map.get(transform);
                if (axes) {
                    this._axes_map.delete(transform);
                    axes.removeFromParent();
                    axes.dispose();
                }
            }
        }
        this.changed = true;
    }
}
CPickSelection.typeName = "CPickSelection";
exports.default = CPickSelection;
//# sourceMappingURL=CPickSelection.js.map