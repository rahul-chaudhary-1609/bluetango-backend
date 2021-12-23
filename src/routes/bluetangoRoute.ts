import express from "express";
import * as bluetangoSchema from '../apiSchema/bluetangoSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";

import * as BluetangoController from "../controllers/bluetango/index";
import * as multer from '../middleware/multerParser';
import * as validators from "../middleware/validators";
import * as helperFunction from "../utils/helperFunction";
import { upload } from "../middleware/multerParser"

const biosRoute = express.Router();

const biosController = new BluetangoController.BiosController();

/* add addBios */
biosRoute.post("/addBios",upload.single('image'), joiSchemaValidation.validateBody(bluetangoSchema.addBios),tokenValidator.validateAdminToken, biosController.addBios);
biosRoute.put("/updateBios",upload.single('image'), joiSchemaValidation.validateBody(bluetangoSchema.updateBios),tokenValidator.validateAdminToken, biosController.updateBios);
biosRoute.delete("/deleteBios/:id",tokenValidator.validateAdminToken, biosController.deleteBios);
biosRoute.get("/getBios", biosController.getBios);
export = biosRoute;