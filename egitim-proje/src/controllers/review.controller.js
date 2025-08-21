const Review = require('../models/Review');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Ürüne yorum yap
const createReview = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  // Ürün kontrolü
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(404, 'Ürün bulunamadı'));
  }

  // Daha önce yorum yapılmış mı kontrolü
  const existingReview = await Review.findOne({
    user: userId,
    product: productId
  });

  if (existingReview) {
    return next(new ApiError(400, 'Bu ürüne zaten yorum yapmışsınız'));
  }

  // Yorum oluştur
  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment
  });

  await review.populate('user', 'name');

  // Ürünün ortalama puanını ve yorum sayısını güncelle
  await updateProductRating(productId);

  res.status(201).json(new ApiResponse(201, 'Yorum eklendi', review));
});

// Ürün yorumlarını listele
const getProductReviews = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Ürün kontrolü
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(404, 'Ürün bulunamadı'));
  }

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments({ product: productId });

  res.status(200).json(new ApiResponse(200, 'Yorumlar listelendi', {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }));
});

// Ürünün ortalama puanını güncelle (yardımcı fonksiyon)
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10, // 1 ondalık basamak
    numReviews: reviews.length
  });
};

module.exports = {
  createReview,
  getProductReviews
};
