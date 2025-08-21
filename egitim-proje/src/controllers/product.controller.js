const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Ürün oluştur
const createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, price, stock, category, images } = req.body;

  // Kategori kontrolü
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new ApiError(404, 'Kategori bulunamadı'));
  }

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    category,
    images
  });

  await product.populate('category');

  res.status(201).json(new ApiResponse(201, 'Ürün oluşturuldu', product));
});

// Ürünleri listele (arama, filtreleme, sayfalama)
const getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Filtreleme
  const filter = {};
  
  // Kategori filtresi
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Fiyat filtresi
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Arama
  if (req.query.q) {
    filter.$text = { $search: req.query.q };
  }

  // Sıralama
  let sort = { createdAt: -1 };
  if (req.query.sort) {
    const [field, order] = req.query.sort.split(':');
    sort = { [field]: order === 'desc' ? -1 : 1 };
  }

  const products = await Product.find(filter)
    .populate('category')
    .skip(skip)
    .limit(limit)
    .sort(sort);

  const total = await Product.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, 'Ürünler listelendi', {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }));
});

// Ürün detayı
const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate('category');

  if (!product) {
    return next(new ApiError(404, 'Ürün bulunamadı'));
  }

  res.status(200).json(new ApiResponse(200, 'Ürün detayı', product));
});

// Ürün güncelle
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, price, stock, category, images } = req.body;

  // Kategori kontrolü
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new ApiError(404, 'Kategori bulunamadı'));
    }
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { title, description, price, stock, category, images },
    { new: true, runValidators: true }
  ).populate('category');

  if (!product) {
    return next(new ApiError(404, 'Ürün bulunamadı'));
  }

  res.status(200).json(new ApiResponse(200, 'Ürün güncellendi', product));
});

// Ürün sil
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(404, 'Ürün bulunamadı'));
  }

  res.status(200).json(new ApiResponse(200, 'Ürün silindi'));
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
