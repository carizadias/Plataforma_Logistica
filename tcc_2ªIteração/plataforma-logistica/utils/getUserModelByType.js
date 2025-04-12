// utils/userTypeModelMapper.js
const db = require('../models');

const modelMap = {
  common: db.CommonUserData,
  admin: db.AdminUserData,
  post_office_admin: db.PostOfficeAdminData,
  post_office_employee: db.PostOfficeEmployeeData,
};

function getUserModelByType(type) {
  return modelMap[type] || null;
}

module.exports = getUserModelByType;
