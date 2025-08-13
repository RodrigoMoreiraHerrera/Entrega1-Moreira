import { Router } from "express";
import CartControllers from "../controllers/carts.controllers.js";
import { cartAuth } from "../middleware/cartAuth.js";
import { passportCall } from "../middleware/passportAuth.js";

export const cartsRoute = Router();

cartsRoute.get("/", CartControllers.getAll);

cartsRoute.get("/:cid", CartControllers.getById);

cartsRoute.post("/", CartControllers.create);

cartsRoute.post("/:cid/product/:pid", passportCall("jwt"), cartAuth, CartControllers.addProduct);

cartsRoute.delete("/:cid", passportCall("jwt"), cartAuth, CartControllers.emptyCart);

cartsRoute.delete("/:cid/product/:pid", passportCall("jwt"), cartAuth, CartControllers.removeProduct);





