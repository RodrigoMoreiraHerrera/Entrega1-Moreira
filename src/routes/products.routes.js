import { Router } from "express";
import ProductsControllers from "../controllers/products.controllers.js";
import { userAuth } from "../middleware/userAuth.js";
import { passportCall } from "../middleware/passportAuth.js";


export const productsRoute = Router();

productsRoute.get("/", ProductsControllers.getProducts);

productsRoute.get("/:id", ProductsControllers.getProductById);

productsRoute.post("/", passportCall("jwt"), userAuth, ProductsControllers.createProduct);

productsRoute.put("/:pid", passportCall("jwt"), userAuth, ProductsControllers.updateProduct);

productsRoute.delete("/:id", passportCall("jwt"), userAuth, ProductsControllers.deleteProduct);
