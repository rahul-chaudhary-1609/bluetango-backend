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
const ROUTE_PREFIX = `/api/v1/`;
const adminRoute_1 = __importDefault(require("./adminRoute"));
const employeeRoute_1 = __importDefault(require("./employeeRoute"));
const employerRoute_1 = __importDefault(require("./employerRoute"));
const coachRoute_1 = __importDefault(require("./coachRoute"));
const webRoute_1 = __importDefault(require("./webRoute"));
const bluetangoAdminRoute_1 = __importDefault(require("./bluetangoAdminRoute"));
const appUtils = __importStar(require("../utils/appUtils"));
const constants = __importStar(require("../constants"));
//import buleangoRoute from './bluetangoRoute'
module.exports = function (app) {
    app.use(`${ROUTE_PREFIX}admin`, adminRoute_1.default);
    app.use(`${ROUTE_PREFIX}employee`, employeeRoute_1.default);
    app.use(`${ROUTE_PREFIX}employer`, employerRoute_1.default);
    app.use(`${ROUTE_PREFIX}coach`, coachRoute_1.default);
    app.use(`${ROUTE_PREFIX}web`, webRoute_1.default);
    app.use(`${ROUTE_PREFIX}bluetango-admin`, bluetangoAdminRoute_1.default);
    app.use((err, req, res, next) => {
        appUtils.errorResponse(res, err, constants.code.error_code);
    });
};
//# sourceMappingURL=index.js.map