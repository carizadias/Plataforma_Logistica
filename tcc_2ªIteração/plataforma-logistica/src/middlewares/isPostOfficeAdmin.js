const jwt = require('jsonwebtoken');
const { User, PostOfficeUser } = require('../../models');

const isPostOfficeAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado! Faça login novamente.' });
      } else {
        return res.status(401).json({ message: 'Token inválido!' });
      }
    }

    const postOfficeUser = await PostOfficeUser.findByPk(decoded.id);

    if (!postOfficeUser) {
      const user = await User.findByPk(decoded.user_id);

      if (user) {
        return res.status(403).json({ message: "Apenas Administradores do Correio têm permissão para realizar esta ação" })
      }

      res.status(404).json({ message: "Utilizador não encontrado" })
    }

    if (!postOfficeUser.is_active) {
      return res.status(403).json({ message: 'Usuário não esta validado' });
    }
    const roles = await postOfficeUser.getRoles();
    const isAdmin = roles.some(role => role.name === 'admin');

    if (!isAdmin) {
      return res.status(403).json({ message: 'Acesso negado. Você não é um administrador.' });
    }

    req.user = postOfficeUser;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na autenticação do usuário!' });
  }
};

module.exports = { isPostOfficeAdmin };
