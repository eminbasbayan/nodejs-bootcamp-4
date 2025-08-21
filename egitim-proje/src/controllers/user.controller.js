const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Profil bilgilerini getir
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ApiError(404, 'Kullanıcı bulunamadı'));
  }

  res.status(200).json(new ApiResponse(200, 'Profil bilgileri', user));
});

// Tüm kullanıcıları listele (Admin)
const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .select('-refreshTokens')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments();

  res.status(200).json(new ApiResponse(200, 'Kullanıcılar listelendi', {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }));
});

// Kullanıcı rolünü güncelle (Admin)
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['customer', 'admin'].includes(role)) {
    return next(new ApiError(400, 'Geçersiz rol'));
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new ApiError(404, 'Kullanıcı bulunamadı'));
  }

  res.status(200).json(new ApiResponse(200, 'Kullanıcı rolü güncellendi', user));
});

module.exports = {
  getProfile,
  getAllUsers,
  updateUserRole
};
