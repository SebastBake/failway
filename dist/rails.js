"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const maybe_1 = require("./maybe");
exports.Rail = (data) => {
    if (data instanceof Promise) {
        const maybe = data.then(maybe_1.ok);
        // @ts-ignore
        return exports.continueAsyncRail(maybe);
    }
    else {
        const maybe = maybe_1.ok(data);
        // @ts-ignore
        return exports.continueRail(maybe);
    }
};
exports.continueAsyncRail = (item) => Object.freeze({
    done() {
        return item;
    },
    map(mapper) {
        const mapped = item.then((resolved) => __awaiter(this, void 0, void 0, function* () {
            if (maybe_1.isOk(resolved)) {
                return mapper(resolved.data);
            }
            else {
                return resolved;
            }
        }));
        // @ts-ignore
        return exports.continueAsyncRail(mapped);
    },
});
exports.continueRail = (item) => Object.freeze({
    done() {
        return item;
    },
    map(mapper) {
        if (maybe_1.isOk(item)) {
            const mapped = mapper(item.data);
            if (mapped instanceof Promise) {
                return exports.continueAsyncRail(mapped);
            }
            else {
                // @ts-ignore
                return exports.continueRail(mapped);
            }
        }
        else {
            return exports.continueRail(item);
        }
    },
});
