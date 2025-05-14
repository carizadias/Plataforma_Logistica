exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acesso negado. Requer um dos seguintes papéis: ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};
