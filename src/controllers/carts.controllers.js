import CartService from "../mongoDAO/services/carts.service.js";
import ProductService from "../mongoDAO/services/products.service.js";

const carts = new CartService();
const products = new ProductService();

class CartControllers {
  static async getAll(req, res) {
    try {
      const allCarts = await carts.getAll();
      return res.status(200).json(allCarts);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error getting carts", error: error.message });
    }
  }

  static async getById(req, res) {
    const { cid } = req.params;
    try {
      const cart = await carts.getById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      return res.status(200).json(cart);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error getting cart by ID", error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const cart = await carts.create();
      return res.status(201).json(cart);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating cart", error: error.message });
    }
  }

  static async addProduct(req, res) {
    const { cid, pid } = req.params;
    let quantity = req.body.quantity;
    if (!quantity) quantity = 1;

    try {
      let cart = await carts.addProductToCart(cid, pid, quantity);

      const product = await products.getById(pid);
      if (product.stock < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      product.stock -= quantity;
      await product.save();

      res.status(201).json(cart);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error adding product to cart", error: error.message });
    }
  }

  static async emptyCart(req, res) {
    const { cid } = req.params;
    try {
      const clearedCart = await carts.emptyCart(cid);
      if (!clearedCart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      res.status(200).json(clearedCart);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error clearing cart", error: error.message });
    }
  }

  static async removeProduct(req, res) {
    const { cid, pid } = req.params;
    try {
      const cart = await carts.getById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const cartProduct = cart.products.find(
        (item) => item.product.toString() === pid
      );

      const quantity = cartProduct ? cartProduct.quantity : 0;

      const updatedCart = await carts.removeProduct(cid, pid);

      if (quantity > 0) {
        let product = await products.getById(pid);
        if (product) {
          product.stock += quantity;
          await product.save();
        }
      }
      res.status(200).json(updatedCart);
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error removing product from cart",
          error: error.message,
        });
    }
  }

  static async purchase(req, res) {
    const { cid } = req.params;
    const user = req.user;

    try {

    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error processing purchase", error: error.message });
    }
  }
}

export default CartControllers;
