"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const Component_1 = require("@ff/graph/Component");
const CRenderer_1 = require("./CRenderer");
const CTransform_1 = require("./CTransform");
const _context = {
    view: null,
    viewport: null,
    renderer: null,
    scene: null,
    camera: null
};
const _beforeRenderEvent = {
    type: "before-render",
    component: null,
    context: _context
};
const _afterRenderEvent = {
    type: "after-render",
    component: null,
    context: _context
};
const _inputs = {
    activate: Component_1.types.Event("Scene.Activate")
};
/**
 * Represents a 3D scene. Root of a hierarchy of a number of 3D renderable objects and one
 * or multiple cameras. Only one camera at a time can be the "active" camera which is
 * used during each render cycle to render the currently active scene to one or multiple render views.
 */
class CScene extends CTransform_1.default {
    constructor(node, id) {
        super(node, id);
        this._activeCameraComponent = null;
        this._preRenderList = [];
        this._postRenderList = [];
        this._renderListsNeedUpdate = true;
        this.ins = this.addInputs(_inputs, 0);
        this.addEvents("before-render", "after-render", "active-camera");
    }
    get scene() {
        return this.object3D;
    }
    get activeCameraComponent() {
        return this._activeCameraComponent;
    }
    set activeCameraComponent(component) {
        if (component !== this._activeCameraComponent) {
            const previous = this._activeCameraComponent;
            this._activeCameraComponent = component;
            const event = { type: "active-camera", previous, next: component };
            this.emit(event);
        }
    }
    get activeCamera() {
        return this._activeCameraComponent ? this._activeCameraComponent.camera : null;
    }
    get renderer() {
        return this.getMainComponent(CRenderer_1.default);
    }
    create() {
        super.create();
        this.on("hierarchy", this.shouldUpdateRenderLists, this);
        this.on("child", this.shouldUpdateRenderLists, this);
        const renderer = this.renderer;
        if (renderer && !renderer.activeSceneComponent) {
            renderer.activeSceneComponent = this;
        }
    }
    update(context) {
        super.update(context);
        if (this.ins.activate.changed) {
            const renderer = this.renderer;
            if (renderer) {
                renderer.activeSceneComponent = this;
            }
        }
        return true;
    }
    tick(context) {
        if (this._renderListsNeedUpdate) {
            this.updateRenderLists();
            this._renderListsNeedUpdate = false;
        }
        return false;
    }
    dispose() {
        const renderer = this.renderer;
        if (renderer && renderer.activeSceneComponent === this) {
            renderer.activeSceneComponent = null;
        }
        this.off("hierarchy", this.shouldUpdateRenderLists, this);
        this.off("child", this.shouldUpdateRenderLists, this);
        super.dispose();
    }
    preRender(context) {
        const preRenderList = this._preRenderList;
        for (let i = 0, n = preRenderList.length; i < n; ++i) {
            preRenderList[i].preRender(context);
        }
    }
    postRender(context) {
        const postRenderList = this._postRenderList;
        for (let i = 0, n = postRenderList.length; i < n; ++i) {
            postRenderList[i].postRender(context);
        }
    }
    createObject3D() {
        const scene = new three_1.Scene();
        scene.onBeforeRender = this._onBeforeRender.bind(this);
        scene.onAfterRender = this._onAfterRender.bind(this);
        return scene;
    }
    shouldUpdateRenderLists() {
        this._renderListsNeedUpdate = true;
    }
    updateRenderLists() {
        this._preRenderList = [];
        this._postRenderList = [];
        this.traverseDown(false, true, true, (component) => {
            if (component.preRender) {
                this._preRenderList.push(component);
            }
            if (component.postRender) {
                this._postRenderList.push(component);
            }
            return false;
        });
        this.changed = true;
    }
    _onBeforeRender(renderer, scene, camera) {
        _context.view = renderer["__view"];
        _context.viewport = renderer["__viewport"];
        _context.renderer = renderer;
        _context.scene = scene;
        _context.camera = camera;
        this.preRender(_context);
        _beforeRenderEvent.component = this;
        this.emit(_beforeRenderEvent);
    }
    _onAfterRender(renderer, scene, camera) {
        _context.view = renderer["__view"];
        _context.viewport = renderer["__viewport"];
        _context.renderer = renderer;
        _context.scene = scene;
        _context.camera = camera;
        this.postRender(_context);
        _afterRenderEvent.component = this;
        this.emit(_afterRenderEvent);
    }
}
CScene.typeName = "CScene";
CScene.isGraphSingleton = true;
exports.default = CScene;
//# sourceMappingURL=CScene.js.map