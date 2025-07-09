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
const Component_1 = require("@ff/graph/Component");
const Node_1 = require("@ff/graph/Node");
const CSelection_1 = require("@ff/graph/components/CSelection");
const Tree_1 = require("@ff/ui/Tree");
require("./PropertyView");
let PropertyTree = class PropertyTree extends Tree_1.default {
    constructor(system) {
        super();
        this.selection = null;
        this.includeRoot = true;
        this.system = system;
        this.selection = system.getComponent(CSelection_1.default, true);
    }
    firstConnected() {
        super.firstConnected();
        this.classList.add("ff-property-tree");
    }
    connected() {
        super.connected();
        const selection = this.selection;
        selection.selectedNodes.on(Node_1.default, this.onSelectNode, this);
        selection.selectedComponents.on(Component_1.default, this.onSelectComponent, this);
        const node = selection.getSelectedNode();
        if (node) {
            this.root = this.createNodeTreeNode(node);
        }
        else {
            const component = selection.getSelectedComponent();
            this.root = component ? this.createComponentTreeNode(component) : null;
        }
    }
    disconnected() {
        super.disconnected();
        this.selection.selectedNodes.off(Node_1.default, this.onSelectNode, this);
        this.selection.selectedComponents.off(Component_1.default, this.onSelectComponent, this);
    }
    getClasses(node) {
        return node.classes;
    }
    renderNodeHeader(node) {
        if (node.property) {
            return (0, Tree_1.html) `<div class="ff-text ff-property-label ff-ellipsis">${node.text}</div>
                <ff-property-view .property=${node.property}></ff-property-view>`;
        }
        return (0, Tree_1.html) `<div class="ff-text ff-label ff-ellipsis">${node.text}</div>`;
    }
    onSelectNode(event) {
        if (event.add) {
            this.root = this.createNodeTreeNode(event.object);
        }
        else {
            this.root = null;
        }
    }
    onSelectComponent(event) {
        if (event.add) {
            this.root = this.createComponentTreeNode(event.object);
        }
        else {
            this.root = null;
        }
    }
    createNodeTreeNode(node) {
        return {
            id: node.id,
            text: node.displayName,
            classes: "ff-node",
            children: node.components.getArray().map(component => this.createComponentTreeNode(component))
        };
    }
    createComponentTreeNode(component) {
        const id = component.id;
        const inputsId = id + "i";
        const outputsId = id + "o";
        return {
            id,
            text: component.displayName,
            classes: "ff-component",
            property: null,
            children: [
                this.createGroupNode(inputsId, "Inputs", component.ins),
                this.createGroupNode(outputsId, "Outputs", component.outs)
            ]
        };
    }
    createGroupNode(id, text, group) {
        const properties = group.properties;
        const root = {
            id,
            text,
            classes: group.isInputGroup() ? "ff-inputs" : "ff-outputs",
            children: []
        };
        properties.forEach(property => {
            const fragments = property.path.split(".");
            let node = root;
            const count = fragments.length;
            const last = count - 1;
            for (let i = 0; i < count; ++i) {
                const fragment = fragments[i];
                let child = node.children.find(node => node.text === fragment);
                if (!child) {
                    const id = i === last ? property.key : fragment;
                    child = {
                        id,
                        text: fragment,
                        classes: "",
                        children: [],
                        property: i === last ? property : null
                    };
                    node.children.push(child);
                }
                node = child;
            }
        });
        return root;
    }
};
__decorate([
    (0, Tree_1.property)({ attribute: false })
], PropertyTree.prototype, "system", void 0);
PropertyTree = __decorate([
    (0, Tree_1.customElement)("ff-property-tree")
], PropertyTree);
exports.default = PropertyTree;
//# sourceMappingURL=PropertyTree.js.map