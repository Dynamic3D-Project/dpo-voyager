/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { WebGLRenderer, Scene, Camera } from "three";
import { ITypedEvent } from "@ff/core/Publisher";
import { Node } from "@ff/graph/Component";
import RenderView, { Viewport } from "../RenderView";
import CRenderer, { IActiveSceneEvent } from "./CRenderer";
import CTransform from "./CTransform";
import CCamera from "./CCamera";
export { IActiveSceneEvent };
export interface IRenderContext {
    view: RenderView;
    viewport: Viewport;
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
}
interface ISceneRenderEvent<T extends string> extends ITypedEvent<T> {
    component: CScene;
    context: IRenderContext;
}
export interface ISceneBeforeRenderEvent extends ISceneRenderEvent<"before-render"> {
}
export interface ISceneAfterRenderEvent extends ISceneRenderEvent<"after-render"> {
}
export interface IActiveCameraEvent extends ITypedEvent<"active-camera"> {
    previous: CCamera;
    next: CCamera;
}
/**
 * Represents a 3D scene. Root of a hierarchy of a number of 3D renderable objects and one
 * or multiple cameras. Only one camera at a time can be the "active" camera which is
 * used during each render cycle to render the currently active scene to one or multiple render views.
 */
export default class CScene extends CTransform {
    static readonly typeName: string;
    static readonly isGraphSingleton = true;
    private _activeCameraComponent;
    private _preRenderList;
    private _postRenderList;
    private _renderListsNeedUpdate;
    ins: any;
    constructor(node: Node, id: string);
    get scene(): Scene;
    get activeCameraComponent(): CCamera;
    set activeCameraComponent(component: CCamera);
    get activeCamera(): any;
    protected get renderer(): CRenderer;
    create(): void;
    update(context: any): boolean;
    tick(context: any): boolean;
    dispose(): void;
    preRender(context: IRenderContext): void;
    postRender(context: IRenderContext): void;
    protected createObject3D(): any;
    protected shouldUpdateRenderLists(): void;
    protected updateRenderLists(): void;
    private _onBeforeRender;
    private _onAfterRender;
}
