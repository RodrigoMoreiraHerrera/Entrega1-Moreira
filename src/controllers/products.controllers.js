import { io } from "../utils/socket.js";
import ProductService from "../mongoDAO/services/products.service.js";

const products = new ProductService();

class ProductsControllers {

   static async getProducts(req, res) {
  try {
    const allProducts = await products.getAll();
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "error al obtener los productos" });
  }
  };

  static async getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await products.getById(id);

    if (!product) {
      return res.status(404).json({ error: "producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: `error al obtener el productos id: ${id} ` });
  }
  };

  static async createProduct(req, res) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    const productExist = await products.exists(code);
    if (productExist) {
      return res.status(400).json({ error: "el producto ya existe route" });
    }

    let product = await products.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    io.emit("new-product", product);
    res.send({ status: "success", payload: product });
  };

  static async updateProduct(req, res) {
    const { pid } = req.params;
    const updatedProduct = req.body;
    try {
      const product = await products.update(pid, updatedProduct);
      if (!product) {
        return res.status(404).json({ error: "producto no encontrado" });
      }
      io.emit("update-product", product);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "error al actualizar el producto" });
    }
  };

  static async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const product = await products.getById(id);
      const deleteProduct = await products.delete(id);
      if (!deleteProduct) {
        return res.status(404).json({ error: "producto no encontrado" });
      }
      io.emit("delete-product", product);

      res.status(200).json(deleteProduct, product);
    } catch (error) {
      res.status(500).json({ error: "error 2 al eliminar el producto" });
    }
  }

}


export default ProductsControllers;