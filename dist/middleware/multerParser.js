"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.deleteFile = void 0;
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// upload file in the src/upload folder
let folderUploadPath = `../../src/upload`;
const storage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        const dir = path.join(__dirname, folderUploadPath);
        fs.mkdir(dir, err => callback(null, dir));
    },
    filename(req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`);
    },
});
// delete file in the src/upload folder
exports.deleteFile = function (fileName) {
    let filePath = path.join(__dirname, folderUploadPath, fileName);
    return fs.unlinkSync(filePath);
};
// upload function to upload the file
exports.upload = multer_1.default({
    storage: storage,
    limits: {
        fileSize: process.env.UPLOAD_FILE_SIZE_IN_MB,
    },
});
//# sourceMappingURL=multerParser.js.map