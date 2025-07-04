/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import System from "@ff/graph/System";
import Tree from "@ff/ui/Tree";
import CAssetManager, { IAssetEntry, IAssetTreeChangeEvent } from "../components/CAssetManager";
export default class AssetTree extends Tree<IAssetEntry> {
    system: System;
    path: string;
    protected assetManager: CAssetManager;
    constructor();
    protected firstConnected(): void;
    protected connected(): void;
    protected disconnected(): void;
    protected renderNodeHeader(treeNode: IAssetEntry): any;
    protected getChildren(treeNode: IAssetEntry): any[] | null;
    protected getClasses(treeNode: IAssetEntry): string;
    protected getId(treeNode: IAssetEntry): string;
    protected isNodeExpanded(treeNode: IAssetEntry): boolean;
    protected isNodeSelected(treeNode: IAssetEntry): boolean;
    protected onTreeChange(event: IAssetTreeChangeEvent): void;
    protected onContainerClick(): void;
    protected onNodeClick(event: MouseEvent, treeNode: IAssetEntry): void;
    protected onNodeDblClick(event: MouseEvent, treeNode: IAssetEntry): void;
    protected canDrop(event: DragEvent, targetTreeNode: IAssetEntry): boolean;
    protected onNodeDragStart(event: DragEvent, sourceTreeNode: IAssetEntry): any;
    protected onNodeDrop(event: DragEvent, targetTreeNode: IAssetEntry): void;
}
