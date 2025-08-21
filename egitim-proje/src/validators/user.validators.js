const { body, param } = require('express-validator');

const updateRoleValidators = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz kullanıcı ID'),
  body('role')
    .isIn(['customer', 'admin'])
    .withMessage('Rol customer veya admin olmalıdır')
];

module.exports = {
  updateRoleValidators
};
