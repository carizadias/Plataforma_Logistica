const { User, UserRoles, PostOfficeUser } = require('../../models');
const jwt = require('jsonwebtoken');

const isUser = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado! Faça login novamente' });
      } else {
        return res.status(401).json({ message: 'Token inválido' });
      }
    }

    const user = await User.findByPk(decoded.user_id);

    if (!user) {
      const postOfficeUser = await PostOfficeUser.findByPk(decoded.id);
      if (postOfficeUser) {
          return res.status(403).json({ message: "Funcionários dos correios não têm permissão para realizar essa ação"});
        } 
         return res.status(404).json({ message: "Usuário não encontrado"});
    }

    const hasAdminRole = await UserRoles.findOne({
      where: { user_id: user.user_id, user_type: "user" },
    });

    if (!hasAdminRole) {
      return res.status(403).json({ message: "Apenas utilizadores comuns podem realizar essa ação" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro na autenticação do usuário' });
  }
};


module.exports = { isUser };