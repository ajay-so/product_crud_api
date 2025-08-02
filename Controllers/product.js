const { Product } = require("../models/product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const detailedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.send(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, price, featured, rating, createdAt, company } = req.body;
    const newProduct = new Product({ name, price, featured, rating, createdAt, company });
    await newProduct.save();
    res.status(200).json({ message: "New product created", newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted", deletedProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get products by less price
const getProductByLessPrice = async (req, res) => {
  try {
    const { value } = req.params;
    const products = await Product.find({ price: { $lt: value } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getProductByMorePrice = async (req, res) => {
  try {
    const { value } = req.params;
    const products = await Product.find({ price: { $gt: value } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductByLessPrice,
  getProductByMorePrice,
  addProduct,
  deleteProduct,
  updateProduct,
  detailedProduct,
};
