import express from "express";
import { publicController } from "./public.controller.js";

const publicRouter = express.Router();

publicRouter.get("/gear", publicController.getGears);
publicRouter.get("/gear/:id", publicController.getGearById);
publicRouter.get("/categories", publicController.getCategories);

export default publicRouter;
