const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Kategori oluştur
const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  
  // Slug oluştur
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

  const category = await Category.create({
    name,
    slug
  });

  res.status(201).json(new ApiResponse(201, 'Kategori oluşturuldu', category));
});

// Kategorileri listele
const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).sort({ name: 1 });

  res.status(200).json(new ApiResponse(200, 'Kategoriler listelendi', categories));
});

// Kategori güncelle
const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  // Slug oluştur
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug },
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new ApiError(404, 'Kategori bulunamadı'));
  }

  res.status(200).json(new ApiResponse(200, 'Kategori güncellendi', category));
});

// Kategori sil
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(404, 'Kategori bulunamadı'));
  }

  res.status(200).json(new ApiResponse(200, 'Kategori silindi'));
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
