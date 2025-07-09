/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Component, { Node, ITypedEvent } from "@ff/graph/Component";
import { IFileInfo } from "../assets/WebDAVProvider";
export { IFileInfo };
export interface IAssetEntry {
    info: IFileInfo;
    expanded: boolean;
    children: IAssetEntry[];
}
export interface IAssetTreeChangeEvent extends ITypedEvent<"tree-change"> {
    root: IAssetEntry;
}
export interface IAssetOpenEvent extends ITypedEvent<"asset-open"> {
    asset: IAssetEntry;
}
export default class CAssetManager extends Component {
    static readonly typeName: string;
    static readonly isGraphSingleton = true;
    private _provider;
    private _assetsByPath;
    private _rootAsset;
    private _selection;
    constructor(node: Node, id: string);
    get root(): IAssetEntry;
    set root(asset: IAssetEntry);
    get rootPath(): string;
    get rootUrl(): string;
    set rootUrl(url: string);
    get selectedAssets(): IAssetEntry[];
    uploadFiles(files: FileList, folder: IAssetEntry): Promise<any>;
    createFolder(parentFolder: IAssetEntry, folderName: string): Promise<void>;
    rename(asset: IAssetEntry, name: string): Promise<void>;
    exists(asset: IAssetEntry | string): Promise<boolean>;
    open(asset: IAssetEntry): void;
    delete(asset: IAssetEntry): Promise<void>;
    deleteSelected(): Promise<void>;
    moveSelected(destinationFolder: IAssetEntry): Promise<void>;
    select(asset: IAssetEntry, toggle: boolean): void;
    isSelected(asset: IAssetEntry): boolean;
    getAssetURL(uri: string): any;
    getAssetByPath(path: string): Dictionary<IAssetEntry>;
    refresh(): Promise<void>;
    protected rootUrlChanged(): Promise<any>;
    protected createAssetTree(infos: IFileInfo[]): IAssetEntry;
}
