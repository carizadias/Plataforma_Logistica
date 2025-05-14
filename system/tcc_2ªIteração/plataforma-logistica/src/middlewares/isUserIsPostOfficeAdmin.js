const jwt = require('jsonwebtoken');
const {User, PostOfficeUser,PostOfficeUserType, UserRoles} = require('../../models');
//apagar

const isUserisPostalCompanyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido!' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado! Faça login novamente.' });
      } else {
        return res.status(401).json({ error: 'Token inválido!' });
      }
    }

    const user = await User.findByPk(decoded.user_id);
    if (user) {
      const hasUserRole = await UserRoles.findOne({
        where: { user_id: user.user_id, user_type: 'user' },
      });
      if (hasUserRole) {
        req.user = user;
        req.userType = 'user';
        return next();
      }
    }

    const postOfficeUser = await PostOfficeUser.findOne({
      where: { post_office_user_id: decoded.id },
      include: {
        model: PostOfficeUserType,
        as: 'roles',
        attributes: ['name']
      }
    });
    
    if (
      postOfficeUser &&
      postOfficeUser.is_active &&
      postOfficeUser.roles &&
      postOfficeUser.roles.some(role => role.name === 'admin')
    ) {
      req.user = postOfficeUser;
      req.userType = 'post_office';
      return next();
    }
    console.log('Usuário não encontrado ou inválido');
    return res.status(403).json({ error: 'Tipo de usuário inválido' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na autenticação do usuário!' });
  }
};

module.exports = {isUserisPostalCompanyAdmin};