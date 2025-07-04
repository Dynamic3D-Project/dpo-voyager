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
const ColorButton_1 = require("@ff/ui/ColorButton");
const CustomElement_1 = require("@ff/ui/CustomElement");
require("./PropertyField");
////////////////////////////////////////////////////////////////////////////////
const _defaultLabels = ["X", "Y", "Z", "W"];
let PropertyView = class PropertyView extends CustomElement_1.default {
    constructor() {
        super();
        this.property = null;
        this.editButton = null;
        this.onColorChange = this.onColorChange.bind(this);
    }
    firstConnected() {
        this.classList.add("ff-property-view");
    }
    connected() {
        this.property.on("value", this.onPropertyValue, this);
    }
    disconnected() {
        this.property.off("value", this.onPropertyValue, this);
    }
    render() {
        const property = this.property;
        const schema = property.schema;
        if (schema.semantic === "color") {
            const button = new ColorButton_1.default();
            button.selectable = true;
            button.numeric = true;
            button.color.fromArray(property.value);
            button.alpha = property.elementCount > 3;
            button.addEventListener("change", this.onColorChange);
            this.editButton = button;
        }
        else if (property.type === "number" && property.elementCount > 1) {
            this.editButton = null;
        }
        else if (property.type === "string" && property.elementCount === 1) {
            this.editButton = null;
        }
        if (property.isArray()) {
            if (property.elementCount > 4) {
                return;
            }
            const labels = property.schema.labels || _defaultLabels;
            let fields = [];
            for (let i = 0; i < property.elementCount; ++i) {
                fields.push((0, CustomElement_1.html) `
                    <div class="ff-label">${labels[i]}</div>
                    <ff-property-field .property=${property} .index=${i}></ff-property-field>
                `);
            }
            return (0, CustomElement_1.html) `${fields}<div class="ff-edit-button">${this.editButton}</div>`;
        }
        return (0, CustomElement_1.html) `<ff-property-field .property=${property}></ff-property-field>
            <div class="ff-edit-button">${this.editButton}</div>`;
    }
    onColorChange(event) {
        const color = event.detail.color;
        const property = this.property;
        if (property.elementCount > 3) {
            color.toRGBAArray(property.value);
        }
        else {
            color.toRGBArray(property.value);
        }
        property.set();
    }
    onPropertyValue(value) {
        const editButton = this.editButton;
        if (editButton instanceof ColorButton_1.default) {
            editButton.color.fromArray(value);
            editButton.requestUpdate();
        }
    }
};
__decorate([
    (0, CustomElement_1.property)({ attribute: false })
], PropertyView.prototype, "property", void 0);
PropertyView = __decorate([
    (0, CustomElement_1.customElement)("ff-property-view")
], PropertyView);
exports.default = PropertyView;
//# sourceMappingURL=PropertyView.js.map