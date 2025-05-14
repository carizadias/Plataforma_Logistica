const { UserRole, UserType } = require('../../models');
const ROLES = require('../constants/roles');

const isPostalCompanyAdmin = async (req, res, next) => {
  const userId = req.user.user_id;

  const roles = await UserRole.findAll({
    where: { user_id: userId },
    include: { model: UserType, as: 'user_type' }
  });

  const isPostalAdmin = roles.some(role => role.user_type?.name === ROLES.POSTAL_COMPANY_ADMIN);

  if (!isPostalAdmin) {
    return res.status(403).json({ message: "Acesso permitido apenas a utilizadores clientes." });
  }

  next();
};

module.exports = { isPostalCompanyAdmin };
