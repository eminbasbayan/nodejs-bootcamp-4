const Product = require("../models/Product");

// tüm ürünleri getir işlemi
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "category",
      "name description"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ID ile ürün getir

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name description"
    );
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// yeni ürün ekle

const createProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
  });

  try {
    const newProduct = await product.save();
    const populatedProduct = await Product.findById(newProduct._id).populate(
      "category",
      "name description"
    );
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ürün güncelle
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
      },
      { new: true }
    ).populate("category", "name description");

    if (!product) {
      return res.status(404).json({ message: " Ürün bulunamadı" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }
    res.json({ message: "Ürün silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
