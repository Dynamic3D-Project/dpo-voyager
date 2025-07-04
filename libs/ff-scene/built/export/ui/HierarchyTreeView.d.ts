/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import System from "@ff/graph/System";
import Graph from "@ff/graph/Graph";
import Node from "@ff/graph/Node";
import Component from "@ff/graph/Component";
import CSelection, { INodeEvent, IComponentEvent, IActiveGraphEvent } from "@ff/graph/components/CSelection";
import "@ff/ui/Button";
import Tree from "@ff/ui/Tree";
import SelectionView from "./SelectionView";
export default class HierarchyTreeView extends SelectionView {
    protected tree: HierarchyTree;
    constructor(system?: System);
    protected firstConnected(): void;
    protected connected(): void;
    protected disconnected(): void;
    protected render(): any;
    protected onClick(): void;
    protected onClickUp(event: MouseEvent): void;
    protected onClickDown(event: MouseEvent): void;
    protected onContextMenu(): void;
    protected onSelectGraph(event: IComponentEvent): void;
    protected onActiveGraph(event: IActiveGraphEvent): void;
}
type NCG = Node | Component | Graph;
export declare class HierarchyTree extends Tree<NCG> {
    system: System;
    protected selection: CSelection;
    protected rootId: any;
    constructor(system?: System);
    protected firstConnected(): void;
    protected connected(): void;
    protected disconnected(): void;
    protected renderNodeHeader(item: NCG): any;
    protected isNodeSelected(treeNode: NCG): any;
    protected getId(node: NCG): any;
    protected getClasses(node: NCG): "ff-node" | "ff-component" | "ff-system";
    protected getChildren(node: NCG): any;
    protected onNodeClick(event: MouseEvent, node: NCG): void;
    protected onNodeDblClick(event: MouseEvent, treeNode: NCG): void;
    protected onSelectNode(event: INodeEvent): void;
    protected onSelectComponent(event: IComponentEvent): void;
    protected onActiveGraph(event: IActiveGraphEvent): void;
}
export {};
