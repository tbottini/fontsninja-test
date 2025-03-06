"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutInSeconds = timeoutInSeconds;
async function timeoutInSeconds(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
//# sourceMappingURL=timeout.util.js.map