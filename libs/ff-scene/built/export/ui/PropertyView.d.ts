/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Property from "@ff/graph/Property";
import { IColorEditChangeEvent } from "@ff/ui/ColorButton";
import CustomElement from "@ff/ui/CustomElement";
import "./PropertyField";
export default class PropertyView extends CustomElement {
    property: Property;
    protected editButton: HTMLElement;
    constructor();
    protected firstConnected(): void;
    protected connected(): void;
    protected disconnected(): void;
    protected render(): any;
    protected onColorChange(event: IColorEditChangeEvent): void;
    protected onPropertyValue(value: any): void;
}
