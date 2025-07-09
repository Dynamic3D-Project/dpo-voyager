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
var PropertyField_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const math_1 = require("@ff/core/math");
const Property_1 = require("@ff/graph/Property");
exports.Property = Property_1.default;
const CustomElement_1 = require("@ff/ui/CustomElement");
const PopupOptions_1 = require("@ff/ui/PopupOptions");
const LineEdit_1 = require("@ff/ui/LineEdit");
let PropertyField = PropertyField_1 = class PropertyField extends CustomElement_1.default {
    constructor(property) {
        super();
        this.index = undefined;
        this.commitonly = false;
        this.value = undefined;
        this.isActive = false;
        this.isDragging = false;
        this.startValue = 0;
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.editElement = null;
        this.barElement = null;
        this.buttonElement = null;
        this.contentElement = null;
        this.property = property;
        this.onFocus = this.onFocus.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onEditChange = this.onEditChange.bind(this);
        this.onSelectOption = this.onSelectOption.bind(this);
        this.addEventListener("focus", this.onFocus);
        this.addEventListener("click", this.onClick);
        this.addEventListener("contextmenu", this.onContextMenu);
        this.addEventListener("pointerdown", this.onPointerDown);
        this.addEventListener("pointermove", this.onPointerMove);
        this.addEventListener("pointerup", this.onPointerUp);
        this.addEventListener("pointercancel", this.onPointerUp);
    }
    update(changedProperties) {
        // remove child elements
        if (this.contentElement) {
            this.contentElement.remove();
            this.contentElement = null;
        }
        if (this.barElement) {
            this.barElement.remove();
            this.barElement = null;
        }
        if (this.buttonElement) {
            this.buttonElement.remove();
            this.buttonElement = null;
        }
        const property = this.property;
        const schema = property.schema;
        // create content element
        if (schema.event) {
            this.buttonElement = this.appendElement("div");
            this.buttonElement.classList.add("ff-off", "ff-event-button");
        }
        else {
            // create bar element
            const { min, max, bar } = schema;
            if (!schema.options && min !== undefined && max !== undefined && bar !== undefined) {
                this.barElement = this.appendElement("div");
                this.barElement.classList.add("ff-fullsize", "ff-off", "ff-bar");
            }
            // create content (text) element
            this.contentElement = this.appendElement("div");
            this.contentElement.classList.add("ff-fullsize", "ff-off", "ff-content");
        }
        // set css classes based on property/schema traits
        const classList = this.classList;
        const isInput = property.isInput();
        if (isInput) {
            classList.add("ff-input");
            classList.remove("ff-output");
        }
        else {
            classList.add("ff-output");
            classList.remove("ff-input");
        }
        const isLinked = isInput ? property.hasInLinks(this.index) : property.hasOutLinks(this.index);
        isLinked ? classList.add("ff-linked") : classList.remove("ff-linked");
        schema.event ? classList.add("ff-event") : classList.remove("ff-event");
        schema.options ? classList.add("ff-option") : classList.remove("ff-option");
        // set title attribute to provide information about the property
        this.setAttribute("title", property.toString() + (this.index >= 0 ? `[${this.index}]` : ""));
        this.updateElement();
    }
    firstConnected() {
        this.tabIndex = 0;
        this.classList.add("ff-property-field");
        this.style.touchAction = "none";
        this.setAttribute("touch-action", "none");
        if (!this.property) {
            throw new Error("missing property");
        }
    }
    connected() {
        this.property.on("value", this.onPropertyValue, this);
        this.property.on("change", this.onPropertyChange, this);
    }
    disconnected() {
        this.property.off("value", this.onPropertyValue, this);
        this.property.off("change", this.onPropertyChange, this);
    }
    onFocus(event) {
    }
    onClick(event) {
        if (this.editElement) {
            return;
        }
        const property = this.property;
        const schema = property.schema;
        if (schema.event) {
            property.set();
            return;
        }
        if (this.isDragging) {
            return;
        }
        if (schema.options) {
            this.showPopupOptions(event);
            return;
        }
        switch (property.type) {
            case "number":
            case "string":
                this.startEditing();
                break;
            case "boolean":
                this.updateProperty(!this.value, true);
                break;
        }
    }
    onContextMenu(event) {
        if (this.editElement) {
            return;
        }
        this.property.reset();
        event.preventDefault();
    }
    onPointerDown(event) {
        if (!event.isPrimary || event.button !== 0) {
            return;
        }
        this.isDragging = false;
        const property = this.property;
        if (property.type !== "number" || property.schema.options) {
            return;
        }
        this.isActive = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
    }
    onPointerMove(event) {
        if (!event.isPrimary || !this.isActive) {
            return;
        }
        if (!this.isDragging) {
            const dx = event.clientX - this.startX;
            const dy = event.clientY - this.startY;
            const delta = Math.abs(dx) + Math.abs(dy);
            if (delta > 2) {
                this.setPointerCapture(event.pointerId);
                this.isDragging = true;
                this.startX = event.clientX;
                this.startY = event.clientY;
                this.startValue = this.value;
            }
        }
        if (this.isDragging) {
            const dx = event.clientX - this.startX;
            const dy = event.clientY - this.startY;
            const delta = dx - dy;
            const property = this.property;
            const schema = property.schema;
            let speed = PropertyField_1.defaultSpeed;
            if (schema.speed) {
                speed = schema.speed;
            }
            else if (schema.min !== undefined && schema.max !== undefined) {
                speed = (schema.max - schema.min) / this.clientWidth;
            }
            speed = event.ctrlKey ? speed * 0.1 : speed;
            speed = event.shiftKey ? speed * 10 : speed;
            let value = this.startValue + delta * speed;
            value = schema.step !== undefined ? Math.trunc(value / schema.step) * schema.step : value;
            value = schema.min !== undefined ? Math.max(value, schema.min) : value;
            value = schema.max !== undefined ? Math.min(value, schema.max) : value;
            this.updateProperty(value, !this.commitonly);
            event.stopPropagation();
            event.preventDefault();
        }
        this.lastX = event.clientX;
        this.lastY = event.clientY;
    }
    onPointerUp(event) {
        if (this.isActive && event.isPrimary) {
            this.isActive = false;
            if (this.isDragging) {
                event.stopPropagation();
                event.preventDefault();
                if (this.commitonly) {
                    this.property.set();
                }
            }
        }
    }
    onEditChange(event) {
        if (!event.detail.isEditing) {
            this.stopEditing(true);
        }
    }
    startEditing() {
        const property = this.property;
        const schema = property.schema;
        let text = this.value;
        let isNumber = false;
        // convert number properties to string
        if (property.type === "number") {
            isNumber = true;
            if (isFinite(text)) {
                const precision = schema.precision !== undefined
                    ? schema.precision : PropertyField_1.defaultEditPrecision;
                text = this.value.toFixed(precision);
            }
            else {
                text = this.value === -Infinity ? "-inf" : "inf";
            }
        }
        const editElement = this.editElement = this.appendElement(LineEdit_1.default);
        editElement.classList.add("ff-fullsize");
        editElement.align = isNumber ? "right" : "left";
        editElement.text = text;
        editElement.focus();
        editElement.addEventListener("change", this.onEditChange);
    }
    stopEditing(commit) {
        if (!this.editElement) {
            return;
        }
        const editElement = this.editElement;
        this.editElement = null;
        this.removeChild(editElement);
        const property = this.property;
        const schema = property.schema;
        const text = editElement.text;
        let value = text;
        if (this.property.type === "number") {
            if (text.toLowerCase().indexOf("inf") >= 0) {
                value = text[0] === "-" ? -Infinity : Infinity;
            }
            else {
                value = parseFloat(value) || 0;
                if (schema.precision) {
                    const factor = Math.pow(10, schema.precision);
                    value = Math.round(value * factor) / factor;
                }
                value = schema.min !== undefined ? Math.max(value, schema.min) : value;
                value = schema.max !== undefined ? Math.min(value, schema.max) : value;
            }
        }
        this.updateProperty(value, true);
    }
    showPopupOptions(event) {
        const property = this.property;
        const popup = new PopupOptions_1.default();
        popup.options = property.schema.options;
        popup.selectionIndex = property.getValidatedValue();
        popup.position = "anchor";
        popup.anchor = this;
        popup.align = "fixed";
        popup.justify = "end";
        popup.positionX = event.clientX - 10;
        popup.keepVisible = true;
        popup.addEventListener(PopupOptions_1.default.selectEvent, this.onSelectOption);
        document.body.appendChild(popup);
    }
    onSelectOption(event) {
        const index = event.detail.index;
        this.updateProperty(index, true);
    }
    onPropertyValue() {
        this.updateElement();
    }
    onPropertyChange() {
        this.updateElement();
    }
    updateElement() {
        const property = this.property;
        const schema = property.schema;
        if (schema.event) {
            if (property.changed) {
                this.buttonElement.classList.remove("ff-event-flash");
                setTimeout(() => this.buttonElement.classList.add("ff-event-flash"), 0);
            }
            return;
        }
        let value = property.value;
        let text = "";
        if (this.index >= 0) {
            value = value[this.index];
        }
        this.value = value;
        switch (property.type) {
            case "number":
                if (schema.options) {
                    text = property.getOptionText();
                }
                else {
                    if (isFinite(value)) {
                        const precision = schema.precision !== undefined
                            ? schema.precision : PropertyField_1.defaultPrecision;
                        if (schema.percent) {
                            text = (value * 100).toFixed(precision - 2) + "%";
                        }
                        else {
                            text = value.toFixed(precision);
                        }
                        if (this.barElement) {
                            this.barElement.style.width
                                = math_1.default.scaleLimit(value, schema.min, schema.max, 0, 100) + "%";
                        }
                    }
                    else {
                        text = value === -Infinity ? "-inf" : "inf";
                        if (this.barElement) {
                            this.barElement.style.width = "0";
                        }
                    }
                }
                break;
            case "boolean":
                text = value ? "true" : "false";
                break;
            case "string":
                text = value;
                break;
            case "object":
                text = value ? "[object]" : "[null]";
                break;
        }
        this.contentElement.innerText = text;
    }
    updateProperty(value, commit) {
        const property = this.property;
        if (this.index >= 0) {
            property.value[this.index] = value;
        }
        else {
            property.value = value;
        }
        if (commit) {
            property.set();
        }
        else {
            this.updateElement();
        }
    }
};
PropertyField.defaultPrecision = 2;
PropertyField.defaultEditPrecision = 5;
PropertyField.defaultSpeed = 0.1;
__decorate([
    (0, CustomElement_1.property)({ attribute: false })
], PropertyField.prototype, "property", void 0);
__decorate([
    (0, CustomElement_1.property)({ attribute: false })
], PropertyField.prototype, "index", void 0);
__decorate([
    (0, CustomElement_1.property)({ type: Boolean })
], PropertyField.prototype, "commitonly", void 0);
PropertyField = PropertyField_1 = __decorate([
    (0, CustomElement_1.customElement)("ff-property-field")
], PropertyField);
exports.default = PropertyField;
//# sourceMappingURL=PropertyField.js.map