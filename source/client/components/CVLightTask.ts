/**
 * 3D Foundation Project
 * Copyright 2024 Smithsonian Institution
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import CVTask, { types } from "./CVTask";
import LightTaskView from "../ui/story/LightTaskView";

import { Node } from "@ff/graph/Component";
import CVLightManager from "./lights/CVLightManager";
import CVScene from "./CVScene";
import CLight from "@ff/scene/components/CLight";
import { TLightType } from "client/schema/document";
import NVNode from "client/nodes/NVNode";
import { lightTypes } from "client/applications/coreTypes";

////////////////////////////////////////////////////////////////////////////////

export default class CVLightTask extends CVTask
{
    static readonly typeName: string = "CVLightTask";

    static readonly text: string = "Light";
    static readonly icon: string = "lightbulb";

    protected static readonly ins = {
        create: types.Event("Light.Create"),
        delete: types.Event("Light.Delete"),
        changeType: types.Event("Light.ChangeType"),
        activeId: types.String("Light.ActiveId", ""),
        type: types.Option("Light.Type", ["ambient", "directional", "hemisphere", "point", "rect", "spot"], "directional"),
    };

    protected static readonly outs = {
        activeLight: types.Object("Light.Active", CLight),
    };

    ins = this.addInputs<CVTask, typeof CVLightTask.ins>(CVLightTask.ins);
    outs = this.addOutputs<CVTask, typeof CVLightTask.outs>(CVLightTask.outs);

    lightManager: CVLightManager = null;
    scene: CVScene = null;

    get lights(): CLight[] {
        return this.lightManager ? this.lightManager.lights : [];
    }

    get activeLight(): CLight | null {
        const activeId = this.ins.activeId.value;
        return this.lights.find(light => light.id === activeId) || null;
    }

    constructor(node: Node, id: string)
    {
        super(node, id);
    }

    create()
    {
        super.create();
        this.startObserving();
    }

    dispose()
    {
        this.stopObserving();
        super.dispose();
    }

    createView()
    {
        return new LightTaskView(this);
    }

    activateTask()
    {   
        super.activateTask();
    }

    deactivateTask()
    {
        super.deactivateTask();
    }

    update()
    {
        const { activeId, type, create, delete: deleteEvent, changeType } = this.ins;

        if (create.changed) {
            this.createLight();
        }
        if (deleteEvent.changed) {
            this.deleteLight();
        }
        if (changeType.changed) {
            this.changeLightType();
        }

        // Update active light output
        this.outs.activeLight.setValue(this.activeLight);

        this.emit("update");

        return super.update();
    }

    protected onActiveDocument(previous: CVDocument, next: CVDocument)
    {
        if (previous) {
            previous.lightManager.outs.lights.off("value", this.onLightsChanged, this);
        }

        if (next) {
            this.lightManager = next.lightManager;
            this.scene = next.scene;
            this.lightManager.outs.lights.on("value", this.onLightsChanged, this);
        }
        else {
            this.lightManager = null;
            this.scene = null;
        }

        this.onLightsChanged();
        super.onActiveDocument(previous, next);
    }

    protected onLightsChanged()
    {
        this.emit("update");
    }

    protected createLight()
    {
        if (!this.scene) {
            return;
        }

        const lightType = this.ins.type.value as TLightType;
        const LightClass = lightTypes.find(L => (L as any).type === lightType);
        
        if (!LightClass) {
            console.warn(`Unknown light type: ${lightType}`);
            return;
        }

        // Create a new node for the light
        const lightNode = this.scene.object3D.createNode(NVNode);
        lightNode.name = `${LightClass.text}`;

        // Create the light component
        const light = lightNode.createComponent(LightClass);
        
        // Set as active light
        this.ins.activeId.setValue(light.id);
        
        this.emit("update");
    }

    protected deleteLight()
    {
        const light = this.activeLight;
        if (!light) {
            return;
        }

        // Remove the light's node
        light.node.dispose();
        
        // Clear active selection if this was the active light
        if (this.ins.activeId.value === light.id) {
            this.ins.activeId.setValue("");
        }
        
        this.emit("update");
    }

    protected changeLightType()
    {
        const light = this.activeLight;
        if (!light) {
            return;
        }

        const newType = this.ins.type.value as TLightType;
        const newLight = this.lightManager.changeLightType(light, newType);
        
        if (newLight) {
            this.ins.activeId.setValue(newLight.id);
        }
        
        this.emit("update");
    }
}
