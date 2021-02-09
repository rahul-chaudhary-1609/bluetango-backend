"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTempFile = void 0;
const fs_1 = __importDefault(require("fs"));
exports.deleteTempFile = (filePath) => {
    fs_1.default.stat(filePath, (err, stats) => {
        if (err) {
            console.error(err);
        }
        fs_1.default.unlink(filePath, (e) => {
            if (e) {
                console.log(e);
            }
            console.log("file deleted successfully");
        });
    });
};
//# sourceMappingURL=uploadHelper.js.map