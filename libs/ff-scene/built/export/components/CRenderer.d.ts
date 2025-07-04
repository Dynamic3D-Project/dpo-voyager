/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Component, { Node, ITypedEvent } from "@ff/graph/Component";
import { IPulseEvent } from "@ff/graph/components/CPulse";
import RenderView from "../RenderView";
import CScene, { IActiveCameraEvent } from "./CScene";
export declare enum EShadowMapType {
    Basic = 0,
    PCF = 1,
    PCFSoft = 2
}
export { IActiveCameraEvent };
/**
 * Emitted by [[CRenderer]] if the active scene changes.
 * @event
 */
export interface IActiveSceneEvent extends ITypedEvent<"active-scene"> {
    previous: CScene;
    next: CScene;
}
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
export default class CRenderer extends Component {
    static readonly typeName: string;
    static readonly isSystemSingleton: boolean;
    static readonly ins: {
        exposure: any;
        gamma: any;
        shadowsEnabled: any;
        shadowMapType: any;
    };
    static readonly outs: {
        maxTextureSize: any;
        maxCubemapSize: any;
    };
    ins: any;
    outs: any;
    readonly views: RenderView[];
    private _activeSceneComponent;
    private _forceRender;
    constructor(node: Node, id: string);
    get activeSceneComponent(): CScene;
    set activeSceneComponent(component: CScene);
    get activeSceneGraph(): any;
    get activeScene(): any;
    get activeCameraComponent(): import("./CCamera").default;
    get activeCamera(): any;
    forceRender(): void;
    create(): void;
    update(): boolean;
    attachView(view: RenderView): void;
    detachView(view: RenderView): void;
    logInfo(): void;
    protected onPulse(event: IPulseEvent): void;
    protected onActiveCamera(event: IActiveCameraEvent): void;
}
