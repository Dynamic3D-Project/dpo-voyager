/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Property from "@ff/graph/Property";
import CustomElement, { PropertyValues } from "@ff/ui/CustomElement";
import { IPopupMenuSelectEvent } from "@ff/ui/PopupOptions";
import LineEdit, { ILineEditChangeEvent } from "@ff/ui/LineEdit";
export { Property };
export default class PropertyField extends CustomElement {
    static readonly defaultPrecision = 2;
    static readonly defaultEditPrecision = 5;
    static readonly defaultSpeed = 0.1;
    property: Property;
    index: number;
    commitonly: boolean;
    protected value: any;
    protected isActive: boolean;
    protected isDragging: boolean;
    protected startValue: number;
    protected startX: number;
    protected startY: number;
    protected lastX: number;
    protected lastY: number;
    protected editElement: LineEdit;
    protected barElement: HTMLDivElement;
    protected buttonElement: HTMLDivElement;
    protected contentElement: HTMLDivElement;
    constructor(property?: Property);
    protected update(changedProperties: PropertyValues): void;
    protected firstConnected(): void;
    protected connected(): void;
    protected disconnected(): void;
    protected onFocus(event: FocusEvent): void;
    protected onClick(event: MouseEvent): void;
    protected onContextMenu(event: MouseEvent): void;
    protected onPointerDown(event: PointerEvent): void;
    protected onPointerMove(event: PointerEvent): void;
    protected onPointerUp(event: PointerEvent): void;
    protected onEditChange(event: ILineEditChangeEvent): void;
    protected startEditing(): void;
    protected stopEditing(commit: boolean): void;
    protected showPopupOptions(event: MouseEvent): void;
    protected onSelectOption(event: IPopupMenuSelectEvent): void;
    protected onPropertyValue(): void;
    protected onPropertyChange(): void;
    protected updateElement(): void;
    protected updateProperty(value: any, commit: boolean): void;
}
