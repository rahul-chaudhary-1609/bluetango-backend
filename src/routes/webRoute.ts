import express from "express";

import { HomepageController } from "../controllers/web/homepageController";


const webRoute = express.Router();

const homepageController = new HomepageController();




//website API's
/* get all coaches*/
webRoute.get("/getCoaches", homepageController.getCoaches);

/* get all advisors*/
webRoute.get("/getAdvisors", homepageController.getAdvisors);





export = webRoute;