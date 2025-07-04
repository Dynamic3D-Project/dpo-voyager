/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Component, { Node } from "@ff/graph/Component";
export default class CFullscreen extends Component {
    static readonly typeName: string;
    protected static readonly ins: {
        toggle: any;
    };
    protected static readonly outs: {
        fullscreenAvailable: any;
        fullscreenActive: any;
    };
    ins: any;
    outs: any;
    private _fullscreenElement;
    get fullscreenElement(): HTMLElement;
    set fullscreenElement(element: HTMLElement);
    constructor(node: Node, id: string);
    update(context: any): boolean;
    toggle(): void;
    protected onFullscreenChange(event: Event): void;
}
