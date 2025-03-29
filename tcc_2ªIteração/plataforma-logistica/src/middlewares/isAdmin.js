const { User, UserRoles, PostOfficeUser } = require('../../models');
const jwt = require('jsonwebtoken'); 

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token não fornecido!' });

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

    if (!user) {
      const postOfficeUser = await PostOfficeUser.findByPk(decoded.id);
      if (postOfficeUser) {
          return res.status(403).json({ error: "Funcionários dos correios não têm permissão para realizar essa ação!"});
        } 
          res.status(404).json({ error: "Usuário não encontrado!"});
    }

    const hasAdminRole = await UserRoles.findOne({
      where: { user_id: user.user_id, user_type: "admin" },
    });

    if (!hasAdminRole) {
      return res.status(403).json({ error: "Apenas administradores podem realizar essa ação!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na autenticação do usuário!' });
  }
};

module.exports = { isAdmin };