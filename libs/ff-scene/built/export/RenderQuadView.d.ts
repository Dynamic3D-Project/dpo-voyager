/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { ITypedEvent } from "@ff/core/Publisher";
import System from "@ff/graph/System";
import RenderView, { IPointerEvent, ITriggerEvent } from "./RenderView";
export { IPointerEvent, ITriggerEvent };
export declare enum EQuadViewLayout {
    Single = 0,
    HorizontalSplit = 1,
    VerticalSplit = 2,
    Quad = 3
}
export interface ILayoutChange extends ITypedEvent<"layout"> {
    layout: EQuadViewLayout;
}
export default class RenderQuadView extends RenderView {
    private _layout;
    private _horizontalSplit;
    private _verticalSplit;
    constructor(system: System, canvas: HTMLCanvasElement, overlay: HTMLElement);
    set layout(layout: EQuadViewLayout);
    get layout(): EQuadViewLayout;
    set horizontalSplit(value: number);
    get horizontalSplit(): number;
    set verticalSplit(value: number);
    get verticalSplit(): number;
    protected updateSplitPositions(): void;
}
