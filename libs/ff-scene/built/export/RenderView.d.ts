/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { WebGLRenderer, Object3D, Camera, Scene, Box3, Vector3 } from "three";
import Publisher from "@ff/core/Publisher";
import System from "@ff/graph/System";
import Component from "@ff/graph/Component";
import { IKeyboardEvent as IManipKeyboardEvent, IManip, IPointerEvent as IManipPointerEvent, ITriggerEvent as IManipTriggerEvent } from "@ff/browser/ManipTarget";
import Viewport, { IBaseEvent as IViewportBaseEvent } from "@ff/three/Viewport";
import GPUPicker from "@ff/three/GPUPicker";
import CRenderer from "./components/CRenderer";
export { Viewport };
interface IBaseEvent extends IViewportBaseEvent {
    /** The render view on which the event occurred. */
    view: RenderView;
    /** The component the event originates from. */
    component: Component;
    /** The 3D object the event originates from. */
    object3D: Object3D;
    /** In order to stop propagation of the event, set this to true while handling the event. */
    stopPropagation: boolean;
}
export interface IPointerEvent extends IManipPointerEvent, IBaseEvent {
}
export interface ITriggerEvent extends IManipTriggerEvent, IBaseEvent {
}
export interface IKeyboardEvent extends IManipKeyboardEvent, IBaseEvent {
}
export default class RenderView extends Publisher implements IManip {
    readonly system: System;
    readonly renderer: WebGLRenderer;
    readonly canvas: HTMLCanvasElement;
    readonly overlay: HTMLElement;
    readonly viewports: Viewport[];
    protected rendererComponent: CRenderer;
    protected targetViewport: Viewport;
    protected targetObject3D: Object3D;
    protected targetComponent: Component;
    protected targetScene: Scene;
    protected targetCamera: Camera;
    protected defaultScene: any;
    protected defaultCamera: any;
    protected picker: GPUPicker;
    constructor(system: System, canvas: HTMLCanvasElement, overlay: HTMLElement);
    dispose(): void;
    get canvasWidth(): number;
    get canvasHeight(): number;
    attach(): void;
    detach(): void;
    renderImage(width: number, height: number, format: string, quality: number): string;
    render(): void;
    protected setRenderSize(width: number, height: number): void;
    resize(): void;
    setViewportCount(count: number): void;
    getViewportCount(): number;
    onPointer(event: IPointerEvent): boolean;
    onTrigger(event: ITriggerEvent): boolean;
    onKeypress(event: IKeyboardEvent): boolean;
    pickPosition(event: IPointerEvent, range?: Box3, result?: Vector3): any;
    pickNormal(event: IPointerEvent, result?: Vector3): any;
    protected routeEvent(event: IPointerEvent, doHitTest: boolean, doPick: boolean): IPointerEvent;
    protected routeEvent(event: ITriggerEvent, doHitTest: boolean, doPick: boolean): ITriggerEvent;
    protected routeEvent(event: IKeyboardEvent, doHitTest: boolean, doPick: boolean): IKeyboardEvent;
}
