"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateResult = exports.PropertyValues = exports.html = exports.property = exports.customElement = void 0;
const CSelection_1 = require("@ff/graph/components/CSelection");
const SystemView_1 = require("./SystemView");
Object.defineProperty(exports, "customElement", { enumerable: true, get: function () { return SystemView_1.customElement; } });
Object.defineProperty(exports, "property", { enumerable: true, get: function () { return SystemView_1.property; } });
Object.defineProperty(exports, "html", { enumerable: true, get: function () { return SystemView_1.html; } });
Object.defineProperty(exports, "PropertyValues", { enumerable: true, get: function () { return SystemView_1.PropertyValues; } });
Object.defineProperty(exports, "TemplateResult", { enumerable: true, get: function () { return SystemView_1.TemplateResult; } });
class SelectionView extends SystemView_1.default {
    constructor() {
        super(...arguments);
        this.selection = null;
    }
    firstConnected() {
        this.selection = this.system.getComponent(CSelection_1.default);
    }
}
exports.default = SelectionView;
//# sourceMappingURL=SelectionView.js.map