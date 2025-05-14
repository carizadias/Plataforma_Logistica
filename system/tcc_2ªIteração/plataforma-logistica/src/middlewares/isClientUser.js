const { UserRole, UserType } = require('../../models');
const ROLES = require('../constants/roles');

const isClientUser = async (req, res, next) => {
  const userId = req.user.user_id;

  const roles = await UserRole.findAll({
    where: { user_id: userId },
    include: { model: UserType, as: 'user_type' }
  });

  const isClient = roles.some(role => role.user_type?.name === ROLES.CLIENT);

  if (!isClient) {
    return res.status(403).json({ message: "Acesso permitido apenas a utilizadores clientes." });
  }

  next();
};

module.exports = { isClientUser };
