"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EShadowMapType = void 0;
const constants = require("three/src/constants");
const Component_1 = require("@ff/graph/Component");
const CPulse_1 = require("@ff/graph/components/CPulse");
////////////////////////////////////////////////////////////////////////////////
var EShadowMapType;
(function (EShadowMapType) {
    EShadowMapType[EShadowMapType["Basic"] = 0] = "Basic";
    EShadowMapType[EShadowMapType["PCF"] = 1] = "PCF";
    EShadowMapType[EShadowMapType["PCFSoft"] = 2] = "PCFSoft"; /* , VSM */
})(EShadowMapType || (exports.EShadowMapType = EShadowMapType = {}));
const _shadowMapType = {
    [EShadowMapType.Basic]: constants.BasicShadowMap,
    [EShadowMapType.PCF]: constants.PCFShadowMap,
    [EShadowMapType.PCFSoft]: constants.PCFSoftShadowMap,
    //[EShadowMapType.VSM]: constants.VSMShadowMap,
};
/**
 * Manages 3D rendering. Keeps track of one "active" scene/camera pair,
 * and of a number of render views. During each render cycle, the active scene
 * and camera are rendered to each render view.
 *
 * ### Events
 * - *"active-scene"* - emits [[IActiveSceneEvent]] when the active scene changes.
 * - *"active-camera"* - emits [[IActiveCameraEvent]] when the active camera changes.
 *
 * ### See also
 * - [[CScene]]
 * - [[CCamera]]
 * - [[RenderView]]
 */
class CRenderer extends Component_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CRenderer.ins);
        this.outs = this.addOutputs(CRenderer.outs);
        this.views = [];
        this._activeSceneComponent = null;
        this._forceRender = false;
        this.addEvents("active-scene", "active-camera");
    }
    get activeSceneComponent() {
        return this._activeSceneComponent;
    }
    set activeSceneComponent(component) {
        if (component !== this._activeSceneComponent) {
            const previousScene = this._activeSceneComponent;
            const previousCamera = this.activeCameraComponent;
            if (previousScene) {
                previousScene.off("active-camera", this.onActiveCamera, this);
            }
            if (component) {
                component.on("active-camera", this.onActiveCamera, this);
            }
            this._activeSceneComponent = component;
            const nextCamera = this.activeCameraComponent;
            const sceneEvent = { type: "active-scene", previous: previousScene, next: component };
            this.emit(sceneEvent);
            const cameraEvent = { type: "active-camera", previous: previousCamera, next: nextCamera };
            this.emit(cameraEvent);
        }
    }
    get activeSceneGraph() {
        return this._activeSceneComponent ? this._activeSceneComponent.graph : null;
    }
    get activeScene() {
        return this._activeSceneComponent ? this._activeSceneComponent.scene : null;
    }
    get activeCameraComponent() {
        return this._activeSceneComponent ? this._activeSceneComponent.activeCameraComponent : null;
    }
    get activeCamera() {
        const component = this._activeSceneComponent ? this._activeSceneComponent.activeCameraComponent : null;
        return component ? component.camera : null;
    }
    forceRender() {
        this._forceRender = true;
    }
    create() {
        super.create();
        this.trackComponent(CPulse_1.default, component => {
            component.on("pulse", this.onPulse, this);
        }, component => {
            component.off("pulse", this.onPulse, this);
        });
    }
    update() {
        const ins = this.ins;
        if (ins.exposure.changed) {
            this.views.forEach(view => view.renderer.toneMappingExposure = ins.exposure.value);
        }
        if (ins.gamma.changed) {
            /*this.views.forEach(view => view.renderer.gammaFactor = ins.gamma.value);

            const scene = this.activeScene;
            if (scene) {
                scene.traverse(object => {
                    const mesh = object as Mesh;
                    if (mesh.isMesh) {
                        if (Array.isArray(mesh.material)) {
                            mesh.material.forEach(material => material.needsUpdate = true);
                        }
                        else {
                            mesh.material.needsUpdate = true;
                        }
                    }
                });
            }*/
        }
        if (ins.shadowsEnabled.changed) {
            this.views.forEach(view => view.renderer.shadowMap.enabled = ins.shadowsEnabled.value);
        }
        if (ins.shadowMapType.changed) {
            this.views.forEach(view => view.renderer.shadowMap.type = _shadowMapType[ins.shadowMapType.getValidatedValue()]);
        }
        return true;
    }
    attachView(view) {
        // set WebGL caps if it's the first view attached
        if (this.views.length === 0) {
            const renderer = view.renderer;
            const outs = this.outs;
            outs.maxTextureSize.setValue(renderer.capabilities.maxTextureSize);
            outs.maxCubemapSize.setValue(renderer.capabilities.maxCubemapSize);
        }
        this.views.push(view);
        if (ENV_DEVELOPMENT) {
            console.log("RenderSystem.attachView - total views: %s", this.views.length);
        }
    }
    detachView(view) {
        const index = this.views.indexOf(view);
        if (index < 0) {
            throw new Error("render view not registered");
        }
        this.views.splice(index, 1);
        if (ENV_DEVELOPMENT) {
            console.log("RenderSystem.detachView - total views: %s", this.views.length);
        }
    }
    logInfo() {
        this.views.forEach(view => {
            console.log(view.renderer.info);
        });
    }
    onPulse(event) {
        if (event.systemUpdated || this._forceRender) {
            if (ENV_DEVELOPMENT) {
                console.log("CRenderer.onPulse - render views...");
            }
            this.views.forEach(view => {
                if (!view.renderer.xr.isPresenting) {
                    view.render();
                }
            });
            this._forceRender = false;
        }
    }
    onActiveCamera(event) {
        this.emit(event);
    }
}
CRenderer.typeName = "CRenderer";
CRenderer.isSystemSingleton = true;
CRenderer.ins = {
    exposure: Component_1.types.Number("Shading.Exposure", 1),
    gamma: Component_1.types.Number("Shading.Gamma", 2),
    shadowsEnabled: Component_1.types.Boolean("Shadows.Enabled", true),
    shadowMapType: Component_1.types.Enum("Shadows.MapType", EShadowMapType, EShadowMapType.PCF),
};
CRenderer.outs = {
    maxTextureSize: Component_1.types.Integer("Caps.MaxTextureSize"),
    maxCubemapSize: Component_1.types.Integer("Caps.MaxCubemapSize"),
};
exports.default = CRenderer;
//# sourceMappingURL=CRenderer.js.map