import { Router } from "express";
import {
  createUser,
  loginUser,
  getUsers,
} from "../controllers/user.controllers.js";

export const usersRoute = Router();

usersRoute.post("/register", createUser);

usersRoute.post("/login", loginUser);

usersRoute.get("/", getUsers);
