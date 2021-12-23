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
const adminSchema = __importStar(require("../apiSchema/bluetangoAdminSchema"));
const joiSchemaValidation = __importStar(require("../middleware/joiSchemaValidation"));
const tokenValidator = __importStar(require("../middleware/tokenValidator"));
const AdminController = __importStar(require("../controllers/bluetangoAdmin/authController"));
const multerParser_1 = require("../middleware/multerParser");
const bluetangoAdminRoute = express_1.default.Router();
const authController = new AdminController.AuthController();
/* add subAdmin */
bluetangoAdminRoute.post("/addAdmin", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.addAdmin), authController.addAdmin);
/* login route for admin login */
bluetangoAdminRoute.post("/login", joiSchemaValidation.validateBody(adminSchema.login), authController.login);
/* forget pass route for admin */
bluetangoAdminRoute.post("/forgotPassword", joiSchemaValidation.validateBody(adminSchema.forgetPassword), authController.forgetPassword);
/* reset pass route for admin */
bluetangoAdminRoute.post("/resetPassword", tokenValidator.validateBluetangoForgotPasswordToken, joiSchemaValidation.validateBody(adminSchema.resetPassword), authController.resetPassword);
/* upload file route for employee */
bluetangoAdminRoute.post("/uploadFile", tokenValidator.validateBluetangoAdminToken, multerParser_1.upload.single('file'), authController.uploadFile);
/* logout route for admin logout */
bluetangoAdminRoute.get("/logout", tokenValidator.validateBluetangoAdminToken, authController.logout);
module.exports = bluetangoAdminRoute;
//# sourceMappingURL=bluetangoAdminRoute.js.map