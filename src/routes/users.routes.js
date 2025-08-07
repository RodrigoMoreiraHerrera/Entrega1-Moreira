import { Router } from "express";
import { passportCall } from "../middleware/passportAuth.js";
import UserControllers from "../controllers/user.controllers.js";

export const usersRoute = Router();

usersRoute.post("/register", UserControllers.create);

usersRoute.post("/login", UserControllers.login);

usersRoute.get("/", UserControllers.getAll);

usersRoute.get("/current", passportCall("jwt"), UserControllers.getCurrent);

usersRoute.get("/closeSession", UserControllers.logout);


