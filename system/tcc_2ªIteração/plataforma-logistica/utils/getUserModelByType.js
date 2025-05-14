// utils/userTypeModelMapper.js
const db = require('../models');

const modelMap = {
  client: db.ClientUserData,
  system_admin: db.SystemAdminData,
  postal_company_admin_data: db.PostalCompanyAdminData,
  postal_company_employee_data: db.PostalCompanyEmployeeData,
};

function getUserModelByType(type) {
  return modelMap[type] || null;
}

module.exports = getUserModelByType;
