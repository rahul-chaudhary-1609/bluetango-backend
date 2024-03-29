import express from "express";

import { HomepageController } from "../controllers/web/homepageController";


const webRoute = express.Router();

const homepageController = new HomepageController();




//website API's
/* get all coaches*/
webRoute.get("/getCoaches", homepageController.getCoaches);

/* get all advisors*/
webRoute.get("/getAdvisors", homepageController.getAdvisors);

/* get all articles*/
webRoute.get("/getArticles", homepageController.getArticles);

/* get all articles*/
webRoute.get("/getSubscriptions", homepageController.getSubscriptions);

/* get static content */
webRoute.get("/getStaticContent", homepageController.getStaticContent);
/* get Bios */
webRoute.get("/getBios", homepageController.getBios);
export = webRoute;