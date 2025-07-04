"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const CLight_1 = require("./CLight");
////////////////////////////////////////////////////////////////////////////////
class CAmbientLight extends CLight_1.default {
    constructor(node, id) {
        super(node, id);
        this.object3D = new three_1.AmbientLight();
    }
    get light() {
        return this.object3D;
    }
}
CAmbientLight.typeName = "CAmbientLight";
exports.default = CAmbientLight;
//# sourceMappingURL=CAmbientLight.js.map