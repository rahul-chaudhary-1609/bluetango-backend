"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const homepageController_1 = require("../controllers/web/homepageController");
const webRoute = express_1.default.Router();
const homepageController = new homepageController_1.HomepageController();
//website API's
/* get all coaches*/
webRoute.get("/getCoaches", homepageController.getCoaches);
/* get all advisors*/
webRoute.get("/getAdvisors", homepageController.getAdvisors);
module.exports = webRoute;
//# sourceMappingURL=webRoute.js.map