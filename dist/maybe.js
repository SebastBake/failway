"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function err(error, data) {
    return Object.freeze({ status: error, data });
}
exports.err = err;
function isOk(maybe) {
    return maybe.status === "OK";
}
exports.isOk = isOk;
exports.ok = (data) => Object.freeze({ status: "OK", data });
