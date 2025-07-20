import { Router } from "express";
import {
  createUser,
  loginUser,
  getUsers,
} from "../controllers/user.controllers.js";
import { passportCall } from "../middleware/passportAuth.js";
import { userModel } from "../models/user.model.js";

export const usersRoute = Router();

usersRoute.post("/register", createUser);

usersRoute.post("/login", loginUser);

usersRoute.get("/", getUsers);

usersRoute.get("/current", passportCall("jwt"), async (req, res) => {
  const userToken = req.user
  const user = await userModel.findById(req.user.id).lean();
  if (!user) {
    return res.status(401).send("No autorizado");
  }
  res.json({ user, userToken });
  console.log("User Token:", userToken, "User Data:", user);
});