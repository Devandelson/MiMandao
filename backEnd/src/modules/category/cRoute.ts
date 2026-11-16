import { Router } from "express";
const categoryRoute: Router = Router();
const mainRoute = '/category';

import { controllerCategory } from "./controllerCategory.ts";

// --------- Read all categories
categoryRoute.get(mainRoute, controllerCategory.getAllCategories);

export default categoryRoute;