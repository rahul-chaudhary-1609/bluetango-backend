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
const adminSchema = __importStar(require("../apiSchema/adminSchema"));
const joiSchemaValidation = __importStar(require("../middleware/joiSchemaValidation"));
const tokenValidator = __importStar(require("../middleware/tokenValidator"));
const AdminController = __importStar(require("../controllers/admin/index"));
const adminRoute = express_1.default.Router();
const loginController = new AdminController.LoginController();
const employersController = new AdminController.EmployersController();
/* add new admin route for admin */
adminRoute.post("/addNewAdmin", joiSchemaValidation.validateBody(adminSchema.addNewAdmin), loginController.addNewAdmin);
/* login route for admin login */
adminRoute.post("/login", joiSchemaValidation.validateBody(adminSchema.login), loginController.login);
/* forget pass route for admin */
adminRoute.post("/forgotPassword", joiSchemaValidation.validateBody(adminSchema.forgetPassword), loginController.forgetPassword);
/* reset pass route for admin */
adminRoute.post("/resetPassword", joiSchemaValidation.validateBody(adminSchema.resetPassword), loginController.resetPassword);
/* change pass route for admin */
adminRoute.post("/changePassword", joiSchemaValidation.validateBody(adminSchema.changePassword), tokenValidator.validateAdminToken, loginController.changePassword);
/* logout route for admin logout */
adminRoute.get("/logout", tokenValidator.validateAdminToken, loginController.logout);
/* add or edit employers route for employers */
adminRoute.post("/addEditEmployers", joiSchemaValidation.validateBody(adminSchema.addEditEmployers), tokenValidator.validateAdminToken, employersController.addEditEmployers);
/* get employers list route for employers */
adminRoute.get("/getIndustryTypeList", tokenValidator.validateAdminToken, employersController.getIndustryTypeList);
/* get employers list route for employers */
adminRoute.get("/getEmployersList", joiSchemaValidation.validateQueryParams(adminSchema.getEmployersList), tokenValidator.validateAdminToken, employersController.getEmployersList);
/* change employer status activate/deactivate/delete */
adminRoute.put("/changeEmployerStatus", tokenValidator.validateAdminToken, employersController.changeEmployerStatus);
module.exports = adminRoute;
//# sourceMappingURL=adminRoute.js.map