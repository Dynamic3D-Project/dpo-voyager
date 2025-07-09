"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumToArray = void 0;
////////////////////////////////////////////////////////////////////////////////
// ENUM HELPER FUNCTIONS
const enumToArray = function (e) {
    return Object.keys(e).filter(key => isNaN(Number(key)));
};
exports.enumToArray = enumToArray;
//# sourceMappingURL=types.js.map