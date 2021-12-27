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
const BluetangoController = __importStar(require("../controllers/bluetangoAdmin/index"));
const CoachController = __importStar(require("../controllers/bluetangoAdmin/coachController"));
const bluetangoAdminRoute = express_1.default.Router();
const authController = new AdminController.AuthController();
const biosController = new BluetangoController.BiosController();
const coachController = new CoachController.CoachController();
/* add subAdmin */
bluetangoAdminRoute.post("/addAdmin", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.addAdmin), authController.addAdmin);
/* login route for admin login */
bluetangoAdminRoute.post("/login", joiSchemaValidation.validateBody(adminSchema.login), authController.login);
/* update profile */
bluetangoAdminRoute.put("/updateProfile", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.updateProfile), authController.updateProfile);
/* add subAdmin */
bluetangoAdminRoute.put("/changePassword", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.changePassword), authController.changePassword);
/* forget pass route for admin */
bluetangoAdminRoute.post("/forgotPassword", joiSchemaValidation.validateBody(adminSchema.forgetPassword), authController.forgetPassword);
/* reset pass route for admin */
bluetangoAdminRoute.post("/resetPassword", tokenValidator.validateBluetangoForgotPasswordToken, joiSchemaValidation.validateBody(adminSchema.resetPassword), authController.resetPassword);
/* upload file route for employee */
bluetangoAdminRoute.post("/uploadFile", tokenValidator.validateBluetangoAdminToken, multerParser_1.upload.single('file'), authController.uploadFile);
/* logout route for admin logout */
bluetangoAdminRoute.get("/logout", tokenValidator.validateBluetangoAdminToken, authController.logout);
/* get coach list */
bluetangoAdminRoute.get("/getCoachList", tokenValidator.validateBluetangoAdminToken, coachController.getCoachList);
/*  add Bios */
bluetangoAdminRoute.post("/addBios", multerParser_1.upload.single('image'), joiSchemaValidation.validateBody(adminSchema.addBios), tokenValidator.validateBluetangoAdminToken, biosController.addBios);
/* update Bios */
bluetangoAdminRoute.put("/updateBios", multerParser_1.upload.single('image'), joiSchemaValidation.validateBody(adminSchema.updateBios), tokenValidator.validateBluetangoAdminToken, biosController.updateBios);
/* delete Bios */
bluetangoAdminRoute.delete("/deleteBios/:id", tokenValidator.validateBluetangoAdminToken, biosController.deleteBios);
/* get Bios */
bluetangoAdminRoute.get("/getBios", tokenValidator.validateBluetangoAdminToken, biosController.getBios);
module.exports = bluetangoAdminRoute;
//# sourceMappingURL=bluetangoAdminRoute.js.map