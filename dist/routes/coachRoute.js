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
const express_1 = __importDefault(require("express"));
const coachSchema = __importStar(require("../apiSchema/coachSchema"));
const joiSchemaValidation = __importStar(require("../middleware/joiSchemaValidation"));
const tokenValidator = __importStar(require("../middleware/tokenValidator"));
const validators = __importStar(require("../middleware/validators"));
const authController_1 = require("../controllers/coach/authController");
const coachRoute = express_1.default.Router();
const authController = new authController_1.AuthController();
// auth API
/* login route for employee login */
coachRoute.post("/login", validators.trimmer, joiSchemaValidation.validateBody(coachSchema.login), authController.login);
/* reset pass route for all */
coachRoute.post("/resetPassword", validators.trimmer, joiSchemaValidation.validateBody(coachSchema.resetPassword), tokenValidator.validateCoachToken, authController.resetPassword);
module.exports = coachRoute;
//# sourceMappingURL=coachRoute.js.map