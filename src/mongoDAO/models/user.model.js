import mongoose from "mongoose";
import { cartModel } from "./cart.model.js";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
    role: { type: String, default: "user" },
});
userSchema.pre("save", async function (next) {
    try{
        if(!this.cart_id) {
           const newCart = await cartModel.create({ products: [] });
           this.cart_id = newCart._id;  
        }
        next();
    }catch(error){
        console.log(error);
        next(error);
    }
})
export const userModel = mongoose.model("users", userSchema);
