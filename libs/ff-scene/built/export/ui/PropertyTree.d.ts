/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Property from "@ff/graph/Property";
import PropertyGroup from "@ff/graph/PropertyGroup";
import Component from "@ff/graph/Component";
import Node from "@ff/graph/Node";
import System from "@ff/graph/System";
import CSelection, { INodeEvent, IComponentEvent } from "@ff/graph/components/CSelection";
import Tree from "@ff/ui/Tree";
import "./PropertyView";
interface ITreeNode {
    id: string;
    children: ITreeNode[];
    text: string;
    classes: string;
    property?: Property;
}
export default class PropertyTree extends Tree<ITreeNode> {
    system: System;
    protected selection: CSelection;
    constructor(system?: System);
    protected firstConnected(): void;
    protected connected(): void;
    protected disconnected(): void;
    protected getClasses(node: ITreeNode): string;
    protected renderNodeHeader(node: ITreeNode): any;
    protected onSelectNode(event: INodeEvent): void;
    protected onSelectComponent(event: IComponentEvent): void;
    protected createNodeTreeNode(node: Node): ITreeNode;
    protected createComponentTreeNode(component: Component): ITreeNode;
    protected createGroupNode(id: string, text: string, group: PropertyGroup): ITreeNode;
}
export {};
