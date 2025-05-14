const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado. Requer administrador." });
  }
  next();
};

module.exports = { isAdmin };