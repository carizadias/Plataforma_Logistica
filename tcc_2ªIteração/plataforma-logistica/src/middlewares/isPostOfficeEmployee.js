
const isPostOfficeEmployee = async (req, res, next) => {
  if (req.user.role !== "postOfficeEmployee") {
    return res.status(403).json({ message: "Acesso permitido apenas a funcionários de correios." });
  }
  next();
};

module.exports = { isPostOfficeEmployee };