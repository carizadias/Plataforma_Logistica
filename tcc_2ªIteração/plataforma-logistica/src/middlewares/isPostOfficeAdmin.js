const isPostOfficeAdmin = async (req, res, next) => {
  if (req.user.role !== "postOfficeAdmin") {
    return res.status(403).json({ message: "Acesso permitido apenas a administradores de correios." });
  }
  next();
};

module.exports = { isPostOfficeAdmin };