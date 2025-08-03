/**
 *
 */

import Component from "@ff/graph/Component";
import { ICVLight, CLight } from "./lights/CVLight";
import { types } from "@ff/graph/Component";

import { IDocument } from "client/schema/document";
import CVAmbientLight from "./lights/CVAmbientLight";
import CVDirectionalLight from "./lights/CVDirectionalLight";
import CVHemisphereLight from "./lights/CVHemisphereLight";
import CVPointLight from "./lights/CVPointLight";
import CVRectLight from "./lights/CVRectLight";
import CVSpotLight from "./lights/CVSpotLight";
import { lightTypes } from "client/applications/coreTypes";
import { ELightType } from "@ff/scene/components/CLight";

////////////////////////////////////////////////////////////////////////////////

export default class CVLightManager extends Component {
    static readonly typeName: string = "CVLightManager";

    static readonly text: string = "Light Manager";

    static readonly isSystemSingleton = true;

    private readonly _lights = new Map<string, CLight>();

    public get lights() {
        return this._lights;
    }

    static readonly inputs = {};

    create() {
        super.create();
    }

    addLight(light: CLight) {
        let name = light.node.name;

        if (this.lights.has(name)) {
            console.warn(`Light already exists: '${name}'`);
        } else {
            this.lights.set(name, light);
        }
    }

    findNameById(light: CLight): string | undefined {
        for (const [k, v] of this.lights) {
            console.debug(`Checking light: ${k} - ${v.id}`);
            if (light.id == v.id) {
                return k;
            }
        }
        return undefined;
    }

    changeLightType(light: CLight, newType: ELightType): CLight {
        // TODO check if light type has changed

        let name = this.findNameById(light);
        if (name === undefined) {
            throw new Error(`light not found for id: ${light.id}`);
        }
        
        let newLight = this._createLightByType(newType);

        this._copySharedProperties(this.lights.get(name), newLight);

        this.lights.set(name, newLight);
        return newLight;
    }


    _createLightByType(type: ELightType): CLight {
        let LightType = lightTypes.find(L => (L as any).type == type) || lightTypes[type];
        if (!LightType) throw new Error(`unknown light type: '${type}'`)

        return this.createComponent<ICVLight>(LightType);
    }

    _copySharedProperties(oldLight: CLight, newLight: CLight): void {
        // TODO: use Property schema to copy properties
        if (oldLight.ins.color && newLight.ins.color) {
            newLight.ins.color.setValue(oldLight.ins.color.value);
        }

        if (oldLight.ins.intensity && newLight.ins.intensity) {
            newLight.ins.intensity.setValue(oldLight.ins.intensity.value);
        }

        // TODO: Copy common position/transform properties        
    }
}
