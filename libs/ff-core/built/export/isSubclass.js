"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isSubclass;
function isSubclass(derived, base) {
    if (!derived || !base) {
        return false;
    }
    let prototype = derived.prototype;
    while (prototype) {
        if (prototype === base.prototype) {
            return true;
        }
        prototype = prototype.prototype;
    }
    return false;
}
//# sourceMappingURL=isSubclass.js.map