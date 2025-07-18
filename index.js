
import path from "path";


import cookieParser from 'cookie-parser';
import passport from 'passport';

import initializePassport from './src/config/passport.config.js';
//import { passportCall } from './src/middlewares/passportAuth.js';

import express from "express";
import { initSocket } from "./src/utils/socket.js";
//import { Server } from "socket.io";
import Handlebars from "express-handlebars";

import { __dirname } from "./src/utils/__dirname.js";

import { viewsRoutes } from "./src/routes/views.routes.js";
import { productsRoute } from "./src/routes/products.routes.js";
import { cartsRoute } from "./src/routes/carts.routes.js";
import { usersRoute } from "./src/routes/users.routes.js";


import dotenv from 'dotenv';




import mongoose from "mongoose";
import { productModel } from "./src/models/product.model.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));
app.use(cookieParser(process.env.JWT_SECRET));


initializePassport();
app.use(passport.initialize());


app.engine(
    "hbs",
    Handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",
        helpers: {
      multiply: (a, b) => a * b,
    },

    })
);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "../views"));


app.use("/", viewsRoutes);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
app.use("/api/sessions", usersRoute);

mongoose.connect("mongodb+srv://rodrigomh11:EOyzGoDTZT1hM9zN@cluster0.4k0vr.mongodb.net/Backend1")
.then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


const server = app.listen(PORT, () => 
    console.log(`Server running on port http://localhost:${PORT}`));

export const io = initSocket(server);

io.on("connection", async (socket) => {
    console.log("New connection", socket.id);
    const products = await productModel.find();
    socket.emit("init", products);
});