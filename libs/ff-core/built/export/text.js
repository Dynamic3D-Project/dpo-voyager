"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelize = camelize;
exports.normalize = normalize;
function camelize(text) {
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index == 0 ? letter.toLowerCase() : letter.toUpperCase()).replace(/\s+/g, '');
}
function normalize(text) {
    return text.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}
//# sourceMappingURL=text.js.map