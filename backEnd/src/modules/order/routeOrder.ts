import { Router } from "express";
import { OrderController } from './controllers/oControllers.ts';
import { userRequest } from "./controllers/userRequest.ts";
import { uniqueUserOrders } from "./controllers/uniqueUserOrders.ts";
import cfilterAnother from "./controllers/filterAnother.ts";
import protectedAdminRoute from "@middle/protectedRoute.ts";

const orderRouter: Router = Router();

// ----------- Save
orderRouter.post('/order', OrderController.createMessage);

// --------- Update the state of the order
orderRouter.put('/order', OrderController.updateStateOrder);

orderRouter.post('/order/filterDateAnother/', cfilterAnother);

// Admins request (get user request)
orderRouter.get('/order/userOrders', protectedAdminRoute, userRequest);

orderRouter.get('/order/uniqueUserOrders/:id_user/:typeDate', uniqueUserOrders);

// --------- Read the order
orderRouter.get('/order/:id_order', OrderController.getOrder);

// --------- Read the order of users
orderRouter.get('/order/user/:id_user', OrderController.getUserOrder);

// --------- Read the order of users
orderRouter.get('/order/userLimit/:id_user', OrderController.getUserOrderLimit);

// --------- Delete order
orderRouter.delete('/order/:id_order', OrderController.deleteOrder);

export default orderRouter;