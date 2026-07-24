/**
 * Funded by the Netherlands eScience Center in the context of the
 * [Dynamic 3D]{@link https://research-software-directory.org/projects/dynamic3d} project
 *
 * @author Carsten Schnober <c.schnober@esciencecenter.nl>
 * @license Apache 2.0
 */

import { FogExp2, Color } from "three";

import Component, { types } from "@ff/graph/Component";
import CScene from "client/../../libs/ff-scene/source/components/CScene";
import CRenderer from "@ff/scene/components/CRenderer";
import { IFog } from "client/schema/setup";

////////////////////////////////////////////////////////////////////////////////

const _color = new Color();

export default class CVFog extends Component
{
    static readonly typeName: string = "CVFog";
    static readonly text: string = "Fog";

    protected static readonly fogIns = {
        intensity: types.Number("Fog.Intensity", { preset: 0, min: 0, max: 1 }),
        color: types.ColorRGB("Fog.Color", [ 0.7, 0.7, 0.8 ]),
    };

    ins = this.addInputs(CVFog.fogIns);

    private _fog: FogExp2 = null;

    get settingProperties() {
        return [
            this.ins.intensity,
            this.ins.color
        ];
    }

    protected get sceneNode() {
        return this.getSystemComponent(CScene);
    }

    protected get renderer() {
        return this.getMainComponent(CRenderer);
    }

    create()
    {
        super.create();
    }

    dispose()
    {
        this._remove();

        if (this._fog) {
            this._fog = null;
        }

        super.dispose();
    }

    update(context?)
    {
        const ins = this.ins;
        const scene = this.sceneNode?.scene;

        if (!scene) {
            return false;
        }

      const active = ins.intensity.value > 0;
      if (ins.intensity.changed || ins.color.changed) {
          if (active) {
              if (!this._fog) {
                  this._apply();
              }
              if (ins.color.changed) {
                  _color.fromArray(ins.color.value);
                  this._fog.color.copy(_color);
              }
              // Map intensity (0-1) to density with a power curve for perceptual linearity.
              // FogExp2 is exponential, so raw linear mapping feels way too aggressive.
              this._fog.density = Math.pow(ins.intensity.value, 3) * 0.05;
          } else {
              this._remove();
          }
      }

        return true;
    }

    fromData(data: IFog)
    {
        const ins = this.ins;

        if (data.intensity !== undefined) {
            ins.intensity.setValue(data.intensity);
        }

        if (data.color) {
            ins.color.setValue(data.color);
        }
    }

    toData(): IFog
    {
        const ins = this.ins;

        return {
            intensity: ins.intensity.value,
            color: ins.color.value.slice(),
        };
    }

    protected _apply()
    {
        const scene = this.sceneNode.scene;
        _color.fromArray(this.ins.color.value);

        this._fog = new FogExp2(_color.clone(), Math.pow(this.ins.intensity.value, 3) * 0.05);
        scene.fog = this._fog;
    }

    protected _remove()
    {
        const scene = this.sceneNode?.scene;
        if (scene && scene.fog === this._fog) {
            scene.fog = null;
        }
        this._fog = null;
    }
}
