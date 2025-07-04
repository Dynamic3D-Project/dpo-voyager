/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Component, { IUpdateContext } from "@ff/graph/Component";
import Node from "@ff/graph/Node";
import CSelection from "@ff/graph/components/CSelection";
import { IPointerEvent } from "../RenderView";
import CObject3D from "./CObject3D";
import CTransform from "./CTransform";
export default class CPickSelection extends CSelection {
    static readonly typeName: string;
    ins: any;
    private _brackets_map;
    private _axes_map;
    create(): void;
    dispose(): void;
    update(): boolean;
    protected onSelectNode(node: Node, selected: boolean): void;
    protected onSelectComponent(component: Component, selected: boolean): void;
    protected onPointerUp(event: IPointerEvent): void;
    tick(ctx: IUpdateContext): boolean;
    protected updateBracket(component: CTransform | CObject3D, selected: boolean): void;
}
