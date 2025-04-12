const isCommonUser = async (req, res, next) => {
  if (req.user.role !== "common") {
    return res.status(403).json({ message: "Acesso permitido apenas a utilizadores comuns." });
  }
  next();
};

module.exports = { isCommonUser };