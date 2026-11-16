import { Router } from "express";

const loginRoute: Router = Router();
const mainRoute = '/login';

// middleware
import sessionProfile from '@middle/checkToken.ts';
import upload from '@src/middlewares/image.ts';

// controllers
import checkAccount from "./controllers/checkAccount.ts";
import createAccount from "./controllers/createAccount.ts";
import getUser from "./controllers/getUser.ts";
import getUserByOrder from "./controllers/getUserByOrder.ts";
import checkToken from "./controllers/checkToken.ts";
import authGoogle from "./controllers/authGoogle.ts";
import Logout from "./controllers/logOut.ts";

// ------- Save account
loginRoute.post(mainRoute, upload.single('map'), createAccount)

// ------- Check account
loginRoute.post(`${mainRoute}/check`, checkAccount)

// ------- check Token
loginRoute.post(`${mainRoute}/checkToken`, checkToken)

// ------- Auth with google 
loginRoute.post(`${mainRoute}/auth`, authGoogle)

// ------- Log out
loginRoute.get(`${mainRoute}/logOut`, Logout)

// ------- Get user by id
loginRoute.get(`${mainRoute}/:id_user`, sessionProfile, getUser)

// ------- Get user by idOrder
loginRoute.get(`${mainRoute}/order/:idOrder`, sessionProfile, getUserByOrder)

export default loginRoute;