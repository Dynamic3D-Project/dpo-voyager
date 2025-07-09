"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EQuadViewLayout = void 0;
const UniversalCamera_1 = require("@ff/three/UniversalCamera");
const RenderView_1 = require("./RenderView");
var EQuadViewLayout;
(function (EQuadViewLayout) {
    EQuadViewLayout[EQuadViewLayout["Single"] = 0] = "Single";
    EQuadViewLayout[EQuadViewLayout["HorizontalSplit"] = 1] = "HorizontalSplit";
    EQuadViewLayout[EQuadViewLayout["VerticalSplit"] = 2] = "VerticalSplit";
    EQuadViewLayout[EQuadViewLayout["Quad"] = 3] = "Quad";
})(EQuadViewLayout || (exports.EQuadViewLayout = EQuadViewLayout = {}));
class RenderQuadView extends RenderView_1.default {
    constructor(system, canvas, overlay) {
        super(system, canvas, overlay);
        this._layout = EQuadViewLayout.Quad;
        this._horizontalSplit = 0.5;
        this._verticalSplit = 0.5;
        this.addEvent("layout");
        this.layout = EQuadViewLayout.Single;
    }
    set layout(layout) {
        if (layout === this._layout) {
            return;
        }
        this._layout = layout;
        const viewports = this.viewports;
        switch (this._layout) {
            case EQuadViewLayout.Single:
                this.setViewportCount(1);
                break;
            case EQuadViewLayout.HorizontalSplit:
            case EQuadViewLayout.VerticalSplit:
                this.setViewportCount(2);
                break;
            case EQuadViewLayout.Quad:
                this.setViewportCount(4);
                break;
        }
        this.updateSplitPositions();
        if (viewports[1]) {
            viewports[1].setBuiltInCamera(UniversalCamera_1.EProjection.Orthographic, UniversalCamera_1.EViewPreset.Top);
            viewports[1].enableCameraControl(true).orientationEnabled = false;
        }
        if (viewports[2]) {
            viewports[2].setBuiltInCamera(UniversalCamera_1.EProjection.Orthographic, UniversalCamera_1.EViewPreset.Left);
            viewports[2].enableCameraControl(true).orientationEnabled = false;
        }
        if (viewports[3]) {
            viewports[3].setBuiltInCamera(UniversalCamera_1.EProjection.Orthographic, UniversalCamera_1.EViewPreset.Front);
            viewports[3].enableCameraControl(true).orientationEnabled = false;
        }
        this.emit({ type: "layout", layout });
    }
    get layout() {
        return this._layout;
    }
    set horizontalSplit(value) {
        this._horizontalSplit = value;
        this.updateSplitPositions();
    }
    get horizontalSplit() {
        return this._horizontalSplit;
    }
    set verticalSplit(value) {
        this._verticalSplit = value;
        this.updateSplitPositions();
    }
    get verticalSplit() {
        return this._verticalSplit;
    }
    updateSplitPositions() {
        const h = this._horizontalSplit;
        const v = this._verticalSplit;
        switch (this._layout) {
            case EQuadViewLayout.Single:
                this.viewports[0].setSize(0, 0, 1, 1);
                break;
            case EQuadViewLayout.HorizontalSplit:
                this.viewports[0].setSize(0, 0, h, 1);
                this.viewports[1].setSize(h, 0, 1 - h, 1);
                break;
            case EQuadViewLayout.VerticalSplit:
                this.viewports[0].setSize(0, 1 - v, 1, v);
                this.viewports[1].setSize(0, 0, 1, 1 - v);
                break;
            case EQuadViewLayout.Quad:
                this.viewports[0].setSize(0, 1 - v, h, v);
                this.viewports[1].setSize(h, 1 - v, 1 - h, v);
                this.viewports[2].setSize(0, 0, h, 1 - v);
                this.viewports[3].setSize(h, 0, 1 - h, 1 - v);
                break;
        }
    }
}
exports.default = RenderQuadView;
//# sourceMappingURL=RenderQuadView.js.map