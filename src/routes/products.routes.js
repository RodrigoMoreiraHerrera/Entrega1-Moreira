import { Router } from "express";
import ProductsControllers from "../controllers/products.controllers.js";


export const productsRoute = Router();

productsRoute.get("/", ProductsControllers.getProducts);

productsRoute.get("/:id", ProductsControllers.getProductById);

productsRoute.post("/", ProductsControllers.createProduct);

productsRoute.put("/:pid", ProductsControllers.updateProduct);

productsRoute.delete("/:id",  ProductsControllers.deleteProduct);
