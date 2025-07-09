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
const Tree_1 = require("@ff/ui/Tree");
const CAssetManager_1 = require("../components/CAssetManager");
////////////////////////////////////////////////////////////////////////////////
let AssetTree = class AssetTree extends Tree_1.default {
    constructor() {
        super();
        this.path = "";
        this.assetManager = null;
        this.includeRoot = true;
    }
    firstConnected() {
        super.firstConnected();
        this.classList.add("ff-asset-tree");
        this.addEventListener("click", this.onContainerClick.bind(this));
    }
    connected() {
        super.connected();
        this.assetManager = this.system.components.get(CAssetManager_1.default);
        this.assetManager.on("tree-change", this.onTreeChange, this);
        this.onTreeChange({ type: "tree-change", root: this.assetManager.root });
    }
    disconnected() {
        this.assetManager.off("tree-change", this.onTreeChange, this);
        this.assetManager = null;
        super.disconnected();
    }
    renderNodeHeader(treeNode) {
        const isFolder = treeNode.info.folder;
        const iconName = isFolder ? "folder" : "file";
        const iconClass = isFolder ? "ff-folder" : "ff-file";
        return (0, Tree_1.html) `<ff-icon class=${iconClass} name=${iconName}></ff-icon>
            <div class="ff-text ff-ellipsis">${treeNode.info.name}</div>`;
    }
    getChildren(treeNode) {
        const children = treeNode.children;
        return children.sort((a, b) => {
            if (a.info.folder && !b.info.folder)
                return -1;
            if (!a.info.folder && b.info.folder)
                return 1;
            const aName = a.info.name.toLowerCase();
            const bName = b.info.name.toLowerCase();
            if (aName < bName)
                return -1;
            if (aName > bName)
                return 1;
            return 0;
        });
    }
    getClasses(treeNode) {
        return treeNode.info.folder ? "ff-folder" : "ff-file";
    }
    getId(treeNode) {
        return treeNode.info.path;
    }
    isNodeExpanded(treeNode) {
        return treeNode.expanded;
    }
    isNodeSelected(treeNode) {
        return this.assetManager.isSelected(treeNode);
    }
    onTreeChange(event) {
        // traverse base path to find root tree node
        const parts = this.path.split("/").filter(part => part !== "");
        let root = event.root;
        if (!root)
            return;
        for (let i = 0; i < parts.length; ++i) {
            root = root.children.find(child => child.info.name === parts[i]);
            if (!root) {
                break;
            }
        }
        this.root = root || event.root;
        this.requestUpdate();
    }
    onContainerClick() {
        this.assetManager.select(null, false);
    }
    onNodeClick(event, treeNode) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX - rect.left < 30) {
            this.toggleExpanded(treeNode);
        }
        else {
            this.assetManager.select(treeNode, event.ctrlKey);
        }
    }
    onNodeDblClick(event, treeNode) {
        this.assetManager.open(treeNode);
    }
    canDrop(event, targetTreeNode) {
        // dropping assets and files into folders only
        return targetTreeNode.info.folder &&
            (super.canDrop(event, targetTreeNode) ||
                !!event.dataTransfer.types.find(type => type === "Files"));
    }
    onNodeDragStart(event, sourceTreeNode) {
        this.assetManager.select(sourceTreeNode, event.ctrlKey);
        event.dataTransfer.setData("text/plain", sourceTreeNode.info.path);
        const mimeType = sourceTreeNode.info.type;
        if (mimeType === "image/jpeg" || mimeType === "image/png") {
            const url = this.assetManager.getAssetURL(sourceTreeNode.info.path);
            event.dataTransfer.setData("text/html", `<img src="${url}">`);
        }
        return super.onNodeDragStart(event, sourceTreeNode);
    }
    onNodeDrop(event, targetTreeNode) {
        super.onNodeDrop(event, targetTreeNode);
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            //console.log("dropping files", files.item(0));
            this.assetManager.uploadFiles(files, targetTreeNode);
        }
        else {
            //const sourceTreeNode = this.getNodeFromDragEvent(event);
            //console.log("dropping asset", sourceTreeNode.info.path);
            this.assetManager.moveSelected(targetTreeNode);
        }
    }
};
__decorate([
    (0, Tree_1.property)({ attribute: false })
], AssetTree.prototype, "system", void 0);
__decorate([
    (0, Tree_1.property)({ type: String })
], AssetTree.prototype, "path", void 0);
AssetTree = __decorate([
    (0, Tree_1.customElement)("ff-asset-tree")
], AssetTree);
exports.default = AssetTree;
//# sourceMappingURL=AssetTree.js.map