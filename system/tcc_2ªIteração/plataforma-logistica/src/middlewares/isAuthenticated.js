const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado. Token necessário.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.user_id) {
      req.user = { user_id: decoded.user_id, nif: decoded.nif, type: 'user' };
    } else if (decoded.id) {
      req.user = { id: decoded.id, type: 'post_office_user' };
    } else {
      return res.status(401).json({ message: 'Token inválido. Nenhuma informação de usuário ou funcionário encontrada.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = { isAuthenticated };