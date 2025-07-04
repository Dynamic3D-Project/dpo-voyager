"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CObject3D_1 = require("./CObject3D");
const Floor_1 = require("@ff/three/Floor");
////////////////////////////////////////////////////////////////////////////////
class CFloor extends CObject3D_1.default {
    constructor(node, id) {
        super(node, id);
        this.ins = this.addInputs(CFloor.floorIns);
        this.object3D = new Floor_1.default();
    }
    get floor() {
        return this.object3D;
    }
    update(context) {
        super.update(context);
        const ins = this.ins;
        const floor = this.floor;
        if (ins.position.changed || ins.radius.changed) {
            floor.position.fromArray(ins.position.value);
            floor.scale.setScalar(ins.radius.value);
            floor.updateMatrix();
        }
        if (ins.color.changed) {
            floor.material.color.fromArray(ins.color.value);
        }
        if (ins.opacity.changed) {
            floor.material.opacity = ins.opacity.value;
        }
        return true;
    }
    dispose() {
        this.floor.dispose();
        super.dispose();
    }
}
CFloor.typeName = "CFloor";
CFloor.floorIns = {
    position: CObject3D_1.types.Vector3("Floor.Position", [0, -25, 0]),
    radius: CObject3D_1.types.Number("Floor.Radius", 50),
    color: CObject3D_1.types.ColorRGB("Floor.Color", [0.6, 0.75, 0.8]),
    opacity: CObject3D_1.types.Percent("Floor.Opacity", 0.5),
    castShadow: CObject3D_1.types.Boolean("Shadow.Cast"),
    receiveShadow: CObject3D_1.types.Boolean("Shadow.Receive"),
};
exports.default = CFloor;
//# sourceMappingURL=CFloor.js.map