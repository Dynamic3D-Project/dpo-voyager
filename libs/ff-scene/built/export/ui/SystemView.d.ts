/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import System from "@ff/graph/System";
import CustomElement, { customElement, property, html, PropertyValues, TemplateResult } from "@ff/ui/CustomElement";
export { System, customElement, property, html, PropertyValues, TemplateResult };
export default class SystemView extends CustomElement {
    system: System;
    constructor(system?: System);
}
