import { Router } from "express";
import { ProductController } from './pControllers.ts';
import protectedAdminRoute from "@middle/protectedRoute.ts";

const productRouter: Router = Router();

// middleware
import upload from '@middle/image.ts'
import { controllerCategory } from "../category/controllerCategory.ts";

// ----------- Save
productRouter.post('/product', upload.array('image', 1), protectedAdminRoute, controllerCategory.getC,
     ProductController.createProduct);

// --------- Read all products (optional filter: /product?category=bebidas)
productRouter.post('/product/all', ProductController.getAllProducts);

// --------- Update product
productRouter.put('/product', upload.array('image', 1), protectedAdminRoute,
     controllerCategory.getC,
     ProductController.updateProduct);

// --------- Read products (by the name)
productRouter.get('/product/:name', ProductController.getProduct);

// --------- Read product (by id)
productRouter.get('/product/one/:id_product', ProductController.getOneProduct);

// --------- Delete product
productRouter.delete('/product/:id_product', protectedAdminRoute, ProductController.deleteProduct);

export default productRouter;