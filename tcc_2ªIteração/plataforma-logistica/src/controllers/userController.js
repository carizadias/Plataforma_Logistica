const { User, UserType } = require('../../models');

exports.getUserByNIF = async (req, res) => {
    try {
        const { nif } = req.params;

        const user = await User.findOne({
            where: { nif },
            attributes: ['name', 'surname', 'profile_picture'],

            include: [
                {
                    model: UserType,
                    as: "roles",
                    attributes: ['name'],
                    where: { name: 'user' },
                    through: { attributes: [] }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({user:user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { nif } = req.params;

        const user = await User.findOne({
            where: {
                nif,
            },
            attributes: { exclude: ['password', 'resetToken', 'resetTokenExpire', 'is_active'] },
            include: [
                {
                    model: UserType,
                    as: "roles",
                    attributes: ['name'],
                    where: { name: 'user' },
                    through: { attributes: [] }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário comum não encontrado' });
        }

        res.status(200).json({user: user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};
