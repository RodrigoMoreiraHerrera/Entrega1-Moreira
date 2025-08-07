import { productModel } from "../models/product.model.js";

class ProductService {
  async getAll() {
    return await productModel.find();
  }

  async getById(id) {
    return await productModel.findById(id);
  }

  async exists(code) {
    return await productModel.findOne({ code });
  }

  async create(productData) {
    const newProduct = new productModel(productData);
    await newProduct.save();
    return newProduct;
  }

  async update(id, productData) {
    return await productModel.findByIdAndUpdate(id, productData, {
      new: true,
    });
  }

  async delete(id) {
    return await productModel.findByIdAndDelete(id);
  }

}

export default ProductService;
