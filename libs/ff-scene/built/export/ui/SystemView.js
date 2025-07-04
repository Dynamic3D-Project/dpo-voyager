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
exports.TemplateResult = exports.PropertyValues = exports.html = exports.property = exports.customElement = exports.System = void 0;
const System_1 = require("@ff/graph/System");
exports.System = System_1.default;
const CustomElement_1 = require("@ff/ui/CustomElement");
Object.defineProperty(exports, "customElement", { enumerable: true, get: function () { return CustomElement_1.customElement; } });
Object.defineProperty(exports, "property", { enumerable: true, get: function () { return CustomElement_1.property; } });
Object.defineProperty(exports, "html", { enumerable: true, get: function () { return CustomElement_1.html; } });
Object.defineProperty(exports, "PropertyValues", { enumerable: true, get: function () { return CustomElement_1.PropertyValues; } });
Object.defineProperty(exports, "TemplateResult", { enumerable: true, get: function () { return CustomElement_1.TemplateResult; } });
class SystemView extends CustomElement_1.default {
    constructor(system) {
        super();
        this.system = system;
    }
}
exports.default = SystemView;
__decorate([
    (0, CustomElement_1.property)({ attribute: false })
], SystemView.prototype, "system", void 0);
//# sourceMappingURL=SystemView.js.map