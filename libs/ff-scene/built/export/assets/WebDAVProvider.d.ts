/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import * as xmlTools from "xml-js";
import { Dictionary } from "@ff/core/types";
interface IXMLElement extends xmlTools.Element {
    dict?: Dictionary<IXMLElement>;
    texts?: string[];
}
export interface IFileInfo {
    url: string;
    path: string;
    name: string;
    text: string;
    created: string;
    modified: string;
    folder: boolean;
    size: number;
    type: string;
}
export default class WebDAVProvider {
    private _rootUrl;
    private _rootPath;
    constructor(rootUrl?: string);
    set rootUrl(url: string);
    get rootUrl(): string;
    get rootPath(): string;
    get(folderPath: string | IFileInfo, recursive: boolean): Promise<IFileInfo[]>;
    create(parentPath: string | IFileInfo, folderName: string): Promise<void>;
    delete(filePath: string | IFileInfo): Promise<void>;
    rename(filePath: string | IFileInfo, name: string): Promise<void>;
    move(filePath: string | IFileInfo, destinationPath: string | IFileInfo): Promise<void>;
    exists(filePath: string | IFileInfo): Promise<boolean>;
    protected parseMultistatus(element: IXMLElement): IFileInfo[];
    protected parseResponse(element: IXMLElement): IFileInfo;
}
export {};
