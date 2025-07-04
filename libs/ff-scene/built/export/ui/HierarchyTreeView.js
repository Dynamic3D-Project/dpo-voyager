"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyTree = void 0;
const uniqueId_1 = require("@ff/core/uniqueId");
const Graph_1 = require("@ff/graph/Graph");
const Node_1 = require("@ff/graph/Node");
const Component_1 = require("@ff/graph/Component");
const CGraph_1 = require("@ff/graph/components/CGraph");
const CHierarchy_1 = require("@ff/graph/components/CHierarchy");
const CSelection_1 = require("@ff/graph/components/CSelection");
require("@ff/ui/Button");
const Tree_1 = require("@ff/ui/Tree");
const SelectionView_1 = require("./SelectionView");
////////////////////////////////////////////////////////////////////////////////
let HierarchyTreeView = class HierarchyTreeView extends SelectionView_1.default {
    constructor(system) {
        super(system);
        this.tree = null;
        this.addEventListener("click", this.onClick.bind(this));
        this.addEventListener("contextmenu", this.onContextMenu.bind(this));
    }
    firstConnected() {
        super.firstConnected();
        this.classList.add("ff-hierarchy-tree-view");
        this.tree = new HierarchyTree(this.system);
    }
    connected() {
        super.connected();
        this.selection.selectedComponents.on(CGraph_1.default, this.onSelectGraph, this);
        this.selection.on("active-graph", this.onActiveGraph, this);
    }
    disconnected() {
        super.disconnected();
        this.selection.selectedComponents.off(CGraph_1.default, this.onSelectGraph, this);
        this.selection.off("active-graph", this.onActiveGraph, this);
    }
    render() {
        const selection = this.selection;
        const activeGraphComponent = selection.activeGraph && selection.activeGraph.parent;
        const text = activeGraphComponent ? activeGraphComponent.displayName : "Main";
        const down = selection.hasChildGraph() ? (0, SelectionView_1.html) `<ff-button icon="down" @click=${this.onClickDown}></ff-button>` : null;
        const up = selection.hasParentGraph() ? (0, SelectionView_1.html) `<ff-button icon="up" @click=${this.onClickUp}></ff-button>` : null;
        return (0, SelectionView_1.html) `<div class="ff-flex-row ff-header">${up}<div class="ff-text">${text}</div>${down}</div>
            <div class="ff-flex-item-stretch"><div class="ff-scroll-y">${this.tree}</div></div>`;
    }
    onClick() {
        this.selection.clearSelection();
    }
    onClickUp(event) {
        event.stopPropagation();
        this.selection.activateParentGraph();
    }
    onClickDown(event) {
        event.stopPropagation();
        this.selection.activateChildGraph();
    }
    onContextMenu() {
    }
    onSelectGraph(event) {
        this.requestUpdate();
    }
    onActiveGraph(event) {
        this.requestUpdate();
    }
};
HierarchyTreeView = __decorate([
    (0, SelectionView_1.customElement)("ff-hierarchy-tree-view")
], HierarchyTreeView);
exports.default = HierarchyTreeView;
let HierarchyTree = class HierarchyTree extends Tree_1.default {
    constructor(system) {
        super();
        this.selection = null;
        this.rootId = (0, uniqueId_1.default)();
        this.system = system;
    }
    firstConnected() {
        super.firstConnected();
        this.classList.add("ff-hierarchy-tree");
        this.selection = this.system.getComponent(CSelection_1.default, true);
        this.root = this.selection.activeGraph;
    }
    connected() {
        super.connected();
        const selection = this.selection;
        selection.selectedNodes.on(Node_1.default, this.onSelectNode, this);
        selection.selectedComponents.on(Component_1.default, this.onSelectComponent, this);
        selection.on("active-graph", this.onActiveGraph, this);
        selection.system.nodes.on(Node_1.default, this.onUpdate, this);
        selection.system.components.on(Component_1.default, this.onUpdate, this);
        selection.system.on("hierarchy", this.onUpdate, this);
    }
    disconnected() {
        super.disconnected();
        const selection = this.selection;
        selection.selectedNodes.off(Node_1.default, this.onSelectNode, this);
        selection.selectedComponents.off(Component_1.default, this.onSelectComponent, this);
        selection.off("active-graph", this.onActiveGraph, this);
        selection.system.nodes.off(Node_1.default, this.onUpdate, this);
        selection.system.components.off(Component_1.default, this.onUpdate, this);
        selection.system.off("hierarchy", this.onUpdate, this);
    }
    renderNodeHeader(item) {
        if (item instanceof Component_1.default || item instanceof Node_1.default) {
            if (item instanceof CGraph_1.default) {
                return (0, SelectionView_1.html) `<div class="ff-text ff-ellipsis"><b>${item.displayName}</b></div>`;
            }
            return (0, SelectionView_1.html) `<div class="ff-text ff-ellipsis">${item.displayName}</div>`;
        }
        else {
            const text = item.parent ? item.parent.displayName : "Main";
            return (0, SelectionView_1.html) `<div class="ff-text">${text}</div>`;
        }
    }
    isNodeSelected(treeNode) {
        const selection = this.selection;
        if (treeNode instanceof Component_1.default) {
            return selection.selectedComponents.contains(treeNode);
        }
        else if (treeNode instanceof Node_1.default) {
            return selection.selectedNodes.contains(treeNode);
        }
        return false;
    }
    getId(node) {
        return node.id || this.rootId;
    }
    getClasses(node) {
        if (node instanceof Node_1.default) {
            return "ff-node";
        }
        if (node instanceof Component_1.default) {
            return "ff-component";
        }
        return "ff-system";
    }
    getChildren(node) {
        if (node instanceof Node_1.default) {
            let children = node.components.getArray();
            const hierarchy = node.components.get(CHierarchy_1.default, true);
            if (hierarchy) {
                children = children.concat(hierarchy.children.map(child => child.node));
            }
            return children;
        }
        if (node instanceof Graph_1.default) {
            return node.findRootNodes();
        }
        return null;
    }
    onNodeClick(event, node) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX - rect.left < 30) {
            this.toggleExpanded(node);
        }
        else if (node instanceof Node_1.default) {
            this.selection.selectNode(node, event.ctrlKey);
        }
        else if (node instanceof Component_1.default) {
            this.selection.selectComponent(node, event.ctrlKey);
        }
    }
    onNodeDblClick(event, treeNode) {
        if (treeNode instanceof CGraph_1.default) {
            this.selection.activeGraph = treeNode.innerGraph;
        }
    }
    onSelectNode(event) {
        this.setSelected(event.object, event.add);
    }
    onSelectComponent(event) {
        this.setSelected(event.object, event.add);
    }
    onActiveGraph(event) {
        this.root = this.selection.activeGraph;
    }
};
exports.HierarchyTree = HierarchyTree;
__decorate([
    (0, SelectionView_1.property)({ attribute: false })
], HierarchyTree.prototype, "system", void 0);
exports.HierarchyTree = HierarchyTree = __decorate([
    (0, SelectionView_1.customElement)("ff-hierarchy-tree")
], HierarchyTree);
//# sourceMappingURL=HierarchyTreeView.js.map