const { PostOffice, PostOfficeUser } = require('../../models');

//todos estes ficam assim(pelo menos por enquanto))
exports.getPendingPostOffices = async (req, res) => {
  try {
    const pendingPostOffices = await PostOffice.findAll({
      where: { is_active: false, rejected: false }
    });

    res.status(200).json({message: pendingPostOffices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar correios pendentes!" });
  }
};

exports.approvePostOffice = async (req, res) => {
  try {
    const { id } = req.params;

    const postOffice = await PostOffice.findByPk(id);
    if (!postOffice) {
      return res.status(404).json({ message: "Correio não encontrado!" });
    }

    if (postOffice.is_active) {
      return res.status(400).json({ message: "Este correio já está ativo!" });
    }

    postOffice.is_active = true;
    await postOffice.save();

    await PostOfficeUser.update(
      { is_active: true },
      { where: { post_office_id: id } }
    );

    const postOfficeUser = await PostOfficeUser.findOne({
      where: { post_office_id: id },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });

    res.status(200).json({ message: "Correio aprovado com sucesso! Administrador também ativado.", postOffice, postOfficeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao aprovar correio!" });
  }
};

exports.rejectPostOffice = async (req, res) => {
  try {
    const { id } = req.params;

    const postOffice = await PostOffice.findByPk(id);
    if (!postOffice) {
      return res.status(404).json({ message: "Correio não encontrado!" });
    }

    if (postOffice.rejected) {
      return res.status(400).json({ message: "Este correio já foi rejeitado!" });
    }

    postOffice.is_active = false;
    postOffice.rejected = true;
    await postOffice.save();

    await PostOfficeUser.update(
      { is_active: false },
      { where: { post_office_id: id } }
    );

    res.status(200).json({ message: "Correio rejeitado com sucesso!", postOffice });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao rejeitar correio!" });
  }
};

exports.restorePostOffice = async (req, res) => {
  try {
    const { id } = req.params;

    const postOffice = await PostOffice.findByPk(id);
    if (!postOffice) {
      return res.status(404).json({ message: "Correio não encontrado!" });
    }

    if (postOffice.rejected === false) {
      return res.status(400).json({ message: "Este correio já está restaurado!" });
    }

    postOffice.rejected = false;
    postOffice.is_active = false;
    await postOffice.save();

    res.status(200).json({ message: "Correio restaurado com sucesso!", postOffice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao restaurar correio!" });
  }
};
