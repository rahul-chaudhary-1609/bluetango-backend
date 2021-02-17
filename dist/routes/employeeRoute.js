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
const employeeSchema = __importStar(require("../apiSchema/employeeSchema"));
const joiSchemaValidation = __importStar(require("../middleware/joiSchemaValidation"));
const tokenValidator = __importStar(require("../middleware/tokenValidator"));
const validators = __importStar(require("../middleware/validators"));
const multerParser_1 = require("../middleware/multerParser");
const authController_1 = require("../controllers/employee/authController");
const employeeController_1 = require("../controllers/employee/employeeController");
const goalController_1 = require("../controllers/employee/goalController");
const qualitativeMeasurementController_1 = require("../controllers/employee/qualitativeMeasurementController");
const employeeRoute = express_1.default.Router();
const authController = new authController_1.AuthController();
const employeeController = new employeeController_1.EmployeeController();
const goalController = new goalController_1.GoalController();
const qualitativeMeasurementController = new qualitativeMeasurementController_1.QualitativeMeasurementController();
/* login route for employee login */
employeeRoute.post("/login", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.login), authController.login);
/* forget pass route for employee */
employeeRoute.post("/forgotPassword", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.forgotPassword), authController.forgotPassword);
/* reset pass route for all */
employeeRoute.post("/resetPassword", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateForgotPasswordToken, authController.resetPassword);
/* reset pass route for employee */
employeeRoute.post("/employeeResetPassword", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateEmployeeToken, authController.employeeResetPassword);
/* get my profile route for employee */
employeeRoute.get("/getMyProfile", validators.trimmer, tokenValidator.validateEmployeeToken, authController.getMyProfile);
/* update profile route for employee */
employeeRoute.post("/updateProfile", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateProfile), authController.updateProfile);
/* upload file route for employee */
employeeRoute.post("/uploadFile", tokenValidator.validateEmployeeToken, multerParser_1.upload.single('file'), authController.uploadFile);
/* get my profile route for employee */
employeeRoute.get("/getListOfTeamMemberByManagerId", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.limitOffsetValidate), employeeController.getListOfTeamMemberByManagerId);
/* view details route for employee */
employeeRoute.get("/viewDetailsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewDetailsEmployee), employeeController.viewDetailsEmployee);
/* search team meber for manager */
employeeRoute.get("/searchTeamMember", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.searchTeamMember), employeeController.searchTeamMember);
/* add goal for manager */
employeeRoute.post("/addGoal", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addGoal), goalController.addGoal);
/* edit goal for manager */
employeeRoute.post("/editGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.editGoal), goalController.editGoal);
/* view goal for manager */
employeeRoute.get("/viewGoalAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.viewGoalAsManager), goalController.viewGoalAsManager);
/* delete goal for manager */
employeeRoute.delete("/deleteGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewDetailsEmployee), goalController.deleteGoal);
/* get goal request for manager */
employeeRoute.get("/getGoalCompletedRequestAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, goalController.getGoalCompletedRequestAsManager);
/* get goal request for manager */
employeeRoute.post("/goalAcceptRejectAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.goalAcceptRejectAsManager), goalController.goalAcceptRejectAsManager);
/* submit goal for employee */
employeeRoute.post("/submitGoalAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.submitGoalAsEmployee), goalController.submitGoalAsEmployee);
/* view goal for employee */
employeeRoute.get("/viewGoalAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.limitOffsetValidate), goalController.viewGoalAsEmployee);
// QualitativeMeasurement routes
/* add qualitative measurement for employee */
employeeRoute.post("/addQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addQualitativeMeasurement), qualitativeMeasurementController.addQualitativeMeasurement);
/* get qualitative measurement for employee */
employeeRoute.get("/getQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getQualitativeMeasurement), qualitativeMeasurementController.getQualitativeMeasurement);
module.exports = employeeRoute;
//# sourceMappingURL=employeeRoute.js.map