import CVLightManager from "./CVLightManager";
import CVTask, { types } from "./CVTask";

export default class CVLightsTask extends CVTask {
    static readonly typeName: string = "CVLightTask";

    static readonly text: string = "Action";
    static readonly icon: string = "bulb";

    protected static readonly ins = {
        // create: types.Event("Light.Create"),
        // delete: types.Event("Light.Delete"),
        change: types.Event("Light.Change"),
        activeId: types.String("Light.ActiveId", ""),
    }

    protected static readonly outs = {};

    ins = this.addInputs<CVTask, typeof CVLightsTask.ins>(CVLightsTask.ins);
    outs = this.addOutputs<CVTask, typeof CVLightsTask.outs>(CVLightsTask.outs);

    lightManager: CVLightManager = null;

    // constructor(node: Node, id: string) {
    //     super(node, id);
    // }

    deleteLight() {
        // TODO
        // if (this.lightManager) {
        //     this.lightManager.removeLight(this.ins.activeId.value);
        // }
    }

    
}