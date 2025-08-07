import e from "express";
import { cartModel } from "../models/cart.model.js";
import ticketModel from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

class CartService {
  async getAll() {
    return await cartModel.find();
  }

  async getById(id) {
    return await cartModel.findById(id).populate("products.product");
  }

  async create() {
    const cart = await cartModel.create({ products: [] });
    return cart;
  }

  async addProductToCart(cid, pid, quantity) {
    let cart = await cartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) {
      cart = await cartModel.findByIdAndUpdate(
        cid,
        { $push: { products: { product: pid, quantity } } },
        { new: true }
      );
    }

    return cart;
  }

  async emptyCart(cid) {
    return await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
  }

  async removeProduct(cid, pid) {
    return await cartModel.findByIdAndUpdate(
      { _id: cid },
      { $pull: { products: { product: pid } } },
      { new: true }
    );

  }

  async finishPurchase(cid, user) {
    const cart = await cartModel.findById(cid).populate("products.product");
    if (!cart) {
      throw new Error("Cart not found");
    }

    const ticket = await ticketModel.create({
      code: uuidv4(),
      purchase_datetime: Date.now(),
      amount: cart.products.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0),
      purchaser: user.email,
    });
    
    return ticket;
  }

}

export default CartService;