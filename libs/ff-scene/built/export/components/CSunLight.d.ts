/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Object3D, DirectionalLight } from "three";
import { Node } from "@ff/graph/Component";
import CLight from "./CLight";
export default class CSunLight extends CLight {
    static readonly typeName: string;
    protected static readonly sunLightIns: {
        horizon: any;
        azimuth: any;
        altitude: any;
        shadowSize: any;
    };
    ins: any;
    constructor(node: Node, id: string);
    get light(): DirectionalLight;
    update(context: any): boolean;
    /**
     * Updates the sun's position and direction based on horizon, azimuth, and altitude values.
     * Converts astronomical coordinates to 3D scene coordinates.
     */
    protected updateSunPosition(): void;
    protected onAddToParent(parent: Object3D): void;
    protected onRemoveFromParent(parent: Object3D): void;
}
