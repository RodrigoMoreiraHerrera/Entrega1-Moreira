import { Router } from "express";
import CartControllers from "../controllers/carts.controllers.js";

export const cartsRoute = Router();

cartsRoute.get("/", CartControllers.getAll);

cartsRoute.get("/:cid", CartControllers.getById);

cartsRoute.post("/", CartControllers.create);

cartsRoute.post("/:cid/product/:pid", CartControllers.addProduct);

cartsRoute.delete("/:cid", CartControllers.emptyCart);

cartsRoute.delete("/:cid/product/:pid", CartControllers.removeProduct);





