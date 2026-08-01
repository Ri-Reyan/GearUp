import express from "express";
import { publicController } from "./public.controller.js";

const publicRouter = express.Router();

publicRouter.get("/gear", publicController.getGears);
publicRouter.get("/gear/:id", publicController.getGearById);
publicRouter.get("/categories", publicController.getCategories);
publicRouter.get("/search", publicController.searchGear);
publicRouter.get("/filter", publicController.filterGear);

export default publicRouter;
