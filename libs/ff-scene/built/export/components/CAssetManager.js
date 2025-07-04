"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const resolve_pathname_1 = require("resolve-pathname");
const Component_1 = require("@ff/graph/Component");
const WebDAVProvider_1 = require("../assets/WebDAVProvider");
class CAssetManager extends Component_1.default {
    constructor(node, id) {
        super(node, id);
        this._provider = null;
        this._assetsByPath = {};
        this._rootAsset = null;
        this._selection = new Set();
        this._provider = new WebDAVProvider_1.default();
    }
    get root() {
        return this._rootAsset;
    }
    set root(asset) {
        this._rootAsset = asset;
    }
    get rootPath() {
        return this._provider.rootPath;
    }
    get rootUrl() {
        return this._provider.rootUrl;
    }
    set rootUrl(url) {
        this._provider.rootUrl = url;
        this.refresh().then(() => this.rootUrlChanged());
    }
    get selectedAssets() {
        return Array.from(this._selection.values());
    }
    uploadFiles(files, folder) {
        const fileArray = Array.from(files);
        const uploads = fileArray.map(file => {
            const url = (0, resolve_pathname_1.default)(folder.info.path + file.name, this.rootUrl);
            const params = { method: "PUT", credentials: "include", body: file };
            return fetch(url, params);
        });
        return Promise.all(uploads).then(() => this.refresh());
    }
    createFolder(parentFolder, folderName) {
        return this._provider.create(parentFolder.info, folderName).then(() => this.refresh());
    }
    rename(asset, name) {
        return this._provider.rename(asset.info, name).then(() => this.refresh());
    }
    exists(asset) {
        return this._provider.exists(typeof asset === "object" ? asset.info : asset);
    }
    open(asset) {
        this.emit({ type: "asset-open", asset });
    }
    delete(asset) {
        return this._provider.delete(asset.info).then(() => this.refresh());
    }
    deleteSelected() {
        const selected = Array.from(this._selection.values());
        const operations = selected.map(asset => this._provider.delete(asset.info));
        return Promise.all(operations).then(() => this.refresh());
    }
    moveSelected(destinationFolder) {
        const selected = Array.from(this._selection.values());
        const operations = selected.map(asset => this._provider.move(asset.info, destinationFolder.info.path + asset.info.name));
        return Promise.all(operations).then(() => this.refresh());
    }
    select(asset, toggle) {
        const selection = this._selection;
        if (toggle && selection.has(asset)) {
            selection.delete(asset);
        }
        else {
            if (!toggle) {
                selection.clear();
            }
            if (asset) {
                selection.add(asset);
            }
        }
        this.emit({ type: "tree-change", root: this._rootAsset });
    }
    isSelected(asset) {
        return this._selection.has(asset);
    }
    getAssetURL(uri) {
        return (0, resolve_pathname_1.default)(uri, this.rootUrl);
    }
    getAssetByPath(path) {
        return this._assetsByPath[path];
    }
    refresh() {
        return this._provider.get(".", true)
            .then(infos => {
            this._rootAsset = this.createAssetTree(infos);
            this.emit({ type: "tree-change", root: this._rootAsset });
        });
    }
    rootUrlChanged() {
        return Promise.resolve();
    }
    createAssetTree(infos) {
        infos.sort((a, b) => a.url < b.url ? -1 : (a.url > b.url ? 1 : 0));
        const root = {
            info: infos[0],
            expanded: true,
            children: []
        };
        for (let i = 1, ni = infos.length; i < ni; ++i) {
            const info = infos[i];
            const parts = info.path.split("/").filter(part => !!part);
            let entry = root;
            for (let j = 0, nj = parts.length; j < nj; ++j) {
                const part = parts[j];
                if (j < nj - 1) {
                    entry = entry.children.find(child => child.info.name === part);
                    if (!entry) {
                        break;
                    }
                }
                else {
                    const asset = {
                        info,
                        expanded: true,
                        children: []
                    };
                    this._assetsByPath[decodeURI(info.path)] = asset;
                    entry.children.push(asset);
                }
            }
        }
        return root;
    }
}
CAssetManager.typeName = "CAssetManager";
CAssetManager.isGraphSingleton = true;
exports.default = CAssetManager;
//# sourceMappingURL=CAssetManager.js.map