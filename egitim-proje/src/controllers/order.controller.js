const Order = require('../models/Order');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Sipariş oluştur
const createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, payment } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return next(new ApiError(400, 'Sipariş öğeleri boş olamaz'));
  }

  // Ürün kontrolü ve fiyat hesaplama
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return next(new ApiError(404, `Ürün bulunamadı: ${item.product}`));
    }

    if (product.stock < item.quantity) {
      return next(new ApiError(400, `Yetersiz stok: ${product.title}`));
    }

    const orderItem = {
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity
    };

    orderItems.push(orderItem);
    totalAmount += product.price * item.quantity;

    // Stok güncelle
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    payment,
    totalAmount
  });

  await order.populate('items.product user');

  res.status(201).json(new ApiResponse(201, 'Sipariş oluşturuldu', order));
});

// Kullanıcının siparişlerini listele
const getMyOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: userId })
    .populate('items.product')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments({ user: userId });

  res.status(200).json(new ApiResponse(200, 'Siparişler listelendi', {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }));
});

// Tüm siparişleri listele (Admin)
const getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({})
    .populate('user items.product')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments();

  res.status(200).json(new ApiResponse(200, 'Tüm siparişler listelendi', {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }));
});

// Sipariş durumunu güncelle (Admin)
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return next(new ApiError(400, 'Geçersiz sipariş durumu'));
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate('user items.product');

  if (!order) {
    return next(new ApiError(404, 'Sipariş bulunamadı'));
  }

  res.status(200).json(new ApiResponse(200, 'Sipariş durumu güncellendi', order));
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
