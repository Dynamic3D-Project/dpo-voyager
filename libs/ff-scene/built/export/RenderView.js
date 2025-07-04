"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Viewport = void 0;
const three_1 = require("three");
const Publisher_1 = require("@ff/core/Publisher");
const CHierarchy_1 = require("@ff/graph/components/CHierarchy");
const Viewport_1 = require("@ff/three/Viewport");
exports.Viewport = Viewport_1.default;
const ViewportOverlay_1 = require("@ff/three/ui/ViewportOverlay");
const GPUPicker_1 = require("@ff/three/GPUPicker");
const CRenderer_1 = require("./components/CRenderer");
const UniversalCamera_1 = require("@ff/three/UniversalCamera");
class RenderView extends Publisher_1.default {
    constructor(system, canvas, overlay) {
        super();
        this.viewports = [];
        this.rendererComponent = null;
        this.targetViewport = null;
        this.targetObject3D = null;
        this.targetComponent = null;
        this.targetScene = null;
        this.targetCamera = null;
        this.defaultScene = new three_1.Scene();
        this.defaultCamera = new UniversalCamera_1.default();
        this.system = system;
        this.canvas = canvas;
        this.overlay = overlay;
        this.renderer = new three_1.WebGLRenderer({
            canvas,
            antialias: true
        });
        this.renderer.autoClear = false;
        //this.renderer.gammaOutput = true;
        //this.renderer.gammaFactor = 2;
        this.renderer.outputColorSpace = three_1.SRGBColorSpace;
        this.picker = new GPUPicker_1.default(this.renderer);
    }
    dispose() {
        this.renderer.dispose();
        this.viewports.forEach(viewport => viewport.dispose());
    }
    get canvasWidth() {
        return this.canvas.width;
    }
    get canvasHeight() {
        return this.canvas.height;
    }
    attach() {
        const width = this.canvasWidth;
        const height = this.canvasHeight;
        this.viewports.forEach(viewport => viewport.setCanvasSize(width, height));
        this.renderer.setSize(width, height, false);
        this.rendererComponent = this.system.getComponent(CRenderer_1.default, true);
        this.rendererComponent.attachView(this);
    }
    detach() {
        this.rendererComponent = this.system.getComponent(CRenderer_1.default, true);
        this.rendererComponent.detachView(this);
        this.rendererComponent = null;
    }
    renderImage(width, height, format, quality) {
        if (ENV_DEVELOPMENT) {
            console.log("RenderView.renderImage - width: %s, height: %s, format: %s, quality: %s", width, height, format, quality);
        }
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        this.setRenderSize(width, height);
        this.render();
        const dataURL = this.canvas.toDataURL(format, quality);
        this.setRenderSize(canvasWidth, canvasHeight);
        return dataURL;
    }
    render() {
        const sceneComponent = this.rendererComponent.activeSceneComponent;
        if (!sceneComponent) {
            return;
        }
        let scene = sceneComponent.scene;
        let camera = sceneComponent.activeCamera;
        if (!scene || !camera) {
            if (ENV_DEVELOPMENT) {
                console.warn(!scene ? !camera ? "no scene/camera" : "no scene" : "no camera");
            }
            scene = this.defaultScene;
            camera = this.defaultCamera;
        }
        const renderer = this.renderer;
        renderer.clear();
        renderer["__view"] = this;
        const viewports = this.viewports;
        for (let i = 0, n = viewports.length; i < n; ++i) {
            const viewport = viewports[i];
            // Remove when Webkit bug is fixed: https://bugs.webkit.org/show_bug.cgi?id=237230
            let gl = renderer.getContext();
            gl.clear(gl.DEPTH_BUFFER_BIT);
            gl.finish();
            renderer["__viewport"] = viewport;
            const currentCamera = viewport.updateCamera(camera);
            viewport.applyViewport(this.renderer);
            renderer.render(scene, currentCamera);
        }
    }
    setRenderSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.viewports.forEach(viewport => viewport.setCanvasSize(width, height));
        if (!this.renderer.xr.isPresenting) {
            this.renderer.setSize(width, height, false);
        }
    }
    resize() {
        this.setRenderSize(this.canvas.clientWidth, this.canvas.clientHeight);
        if (!this.renderer.xr.isPresenting) {
            this.render();
        }
    }
    setViewportCount(count) {
        const viewports = this.viewports;
        for (let i = count; i < viewports.length; ++i) {
            viewports[i].dispose();
        }
        for (let i = viewports.length; i < count; ++i) {
            const overlay = new ViewportOverlay_1.default().appendTo(this.overlay);
            viewports[i] = new Viewport_1.default();
            viewports[i].setCanvasSize(this.canvasWidth, this.canvasHeight);
            viewports[i].overlay = overlay;
        }
        viewports.length = count;
    }
    getViewportCount() {
        return this.viewports.length;
    }
    onPointer(event) {
        const system = this.system;
        if (!system) {
            return false;
        }
        let doPick = false;
        let doHitTest = false;
        if (event.type === "pointer-hover") {
            doHitTest = true;
        }
        else if (event.isPrimary && event.type === "pointer-down") {
            doHitTest = true;
            doPick = true;
        }
        const viewEvent = this.routeEvent(event, doHitTest, doPick);
        if (viewEvent) {
            const component = viewEvent.component;
            if (component) {
                component.emit(viewEvent);
                const hierarchy = component.getComponent(CHierarchy_1.default);
                if (!viewEvent.stopPropagation && hierarchy) {
                    hierarchy.propagateUp(false, true, viewEvent);
                }
            }
            if (!viewEvent.stopPropagation) {
                this.system.emit(viewEvent);
            }
            if (!viewEvent.stopPropagation) {
                const updated = viewEvent.viewport.onPointer(viewEvent);
                if (updated) {
                    this.system.getMainComponent(CRenderer_1.default).forceRender();
                }
            }
            return true;
        }
        return false;
    }
    onTrigger(event) {
        const system = this.system;
        if (!system) {
            return false;
        }
        const viewEvent = this.routeEvent(event, true, true);
        if (viewEvent) {
            const component = viewEvent.component;
            if (component) {
                component.emit(viewEvent);
                const hierarchy = component.getComponent(CHierarchy_1.default);
                if (!viewEvent.stopPropagation && hierarchy) {
                    hierarchy.propagateUp(false, true, viewEvent);
                }
            }
            if (!viewEvent.stopPropagation) {
                this.system.emit(viewEvent);
            }
            if (!viewEvent.stopPropagation) {
                const updated = viewEvent.viewport.onTrigger(viewEvent);
                if (updated) {
                    this.system.getMainComponent(CRenderer_1.default).forceRender();
                }
            }
            return true;
        }
        return false;
    }
    onKeypress(event) {
        const system = this.system;
        if (!system) {
            return false;
        }
        const viewEvent = this.routeEvent(event, false, false);
        if (viewEvent) {
            const component = viewEvent.component;
            if (component) {
                component.emit(viewEvent);
                const hierarchy = component.getComponent(CHierarchy_1.default);
                if (!viewEvent.stopPropagation && hierarchy) {
                    hierarchy.propagateUp(false, true, viewEvent);
                }
            }
            if (!viewEvent.stopPropagation) {
                this.system.emit(viewEvent);
            }
            if (!viewEvent.stopPropagation) {
                const updated = viewEvent.viewport.onKeyboard(viewEvent);
                if (updated) {
                    this.system.getMainComponent(CRenderer_1.default).forceRender();
                }
            }
            return true;
        }
        return false;
    }
    pickPosition(event, range, result) {
        return this.picker.pickPosition(this.targetScene, this.targetCamera, event, range, result);
    }
    pickNormal(event, result) {
        return this.picker.pickNormal(this.targetScene, this.targetCamera, event, result);
    }
    routeEvent(event, doHitTest, doPick) {
        let viewport = this.targetViewport;
        let component = this.targetComponent && this.targetComponent.node ? this.targetComponent : null;
        let object3D = component ? this.targetObject3D : null;
        // if no active viewport, perform a hit test against all viewports
        if (doHitTest) {
            viewport = null;
            const viewports = this.viewports;
            for (let i = 0, n = viewports.length; i < n; ++i) {
                const vp = viewports[i];
                if (vp.isInside(event)) {
                    viewport = vp;
                    break;
                }
            }
        }
        // without an active viewport, return null to cancel the event
        if (!viewport) {
            return null;
        }
        // if we have an active viewport now, augment event with viewport/view information
        const viewEvent = event;
        viewEvent.view = this;
        viewEvent.viewport = viewport;
        viewEvent.deviceX = viewport.getDeviceX(event.localX);
        viewEvent.deviceY = viewport.getDeviceY(event.localY);
        viewEvent.stopPropagation = false;
        // perform 3D pick
        if (doPick) {
            const sceneComponent = this.rendererComponent.activeSceneComponent;
            const scene = this.targetScene = sceneComponent && sceneComponent.scene;
            const camera = this.targetCamera = sceneComponent && sceneComponent.activeCamera;
            object3D = null;
            component = null;
            if (scene && camera) {
                object3D = this.picker.pickObject(scene, camera, event);
                if (object3D === undefined) {
                    if (ENV_DEVELOPMENT) {
                        console.log("Pick Index - Background");
                    }
                }
                else {
                    let componentObject3D = object3D;
                    while (componentObject3D && !component) {
                        component = componentObject3D.userData["component"];
                        if (!component) {
                            componentObject3D = componentObject3D.parent;
                        }
                    }
                    if (ENV_DEVELOPMENT) {
                        if (component) {
                            console.log("Pick Index - Component: %s", component.typeName);
                        }
                        else {
                            console.warn("Pick Index - Object without component");
                        }
                    }
                }
            }
        }
        viewEvent.object3D = object3D;
        viewEvent.component = component;
        this.targetViewport = viewport;
        this.targetObject3D = object3D;
        this.targetComponent = component;
        return viewEvent;
    }
}
exports.default = RenderView;
//# sourceMappingURL=RenderView.js.map