const bcrypt = require('bcryptjs');
const { User, Address, PostOfficeUser, PostOfficeUserType, PostOffice, UserType } = require('../../models');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');


exports.getProfile = async (req, res) => {
    try {
        let user;
        let roles = [];

        if (req.user.type === 'user' && req.user.user_id) {
            user = await User.findOne({
                where: { user_id: req.user.user_id },
                attributes: { exclude: ['password', 'resetToken', 'resetTokenExpire', 'phone_number_id', 'gender_id', 'profile_picture', 'address_id', 'is_active'] },
                include: [
                    {
                        model: UserType,
                        as: "roles",
                        attributes: ["name"],
                        through: { attributes: [] },
                    },
                ],
            });

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            res.json({
                message: 'Perfil do usuário obtido com sucesso',
                profile: user
            });

        }
        else if (req.user.type === 'post_office_user' && req.user.id) {
            user = await PostOfficeUser.findOne({
                where: { post_office_user_id: req.user.id },
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
                include: [
                    {
                        model: PostOfficeUserType,
                        as: 'roles',
                        attributes: ['name'],
                        through: { attributes: [] },
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }

            if (user.roles) {
                roles = user.roles.map(role => role.name);
            }

            res.json({
                message: 'Perfil do Funcionário obtido com sucesso',
                profile: user
            });

        } else {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter perfil' });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        console.log("Usuário autenticado:", req.user);

        if (!req.user) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }

        let user;
        if (req.user.type === 'user' && req.user.user_id) {
            user = await User.findOne({
                where: { user_id: req.user.user_id },
                attributes: ['nif', 'name', 'email'],
                include: [
                    {
                        model: UserType,
                        as: "roles",
                        attributes: ["name"],
                        through: { attributes: [] },
                    },
                ],
            });

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

        } else if (req.user.type === 'post_office_user' && req.user.id) {
            user = await PostOfficeUser.findOne({
                where: { post_office_user_id: req.user.id },
                attributes: ['post_office_user_id', 'email'],
                include: [
                    {
                        model: PostOfficeUserType,
                        as: 'roles',
                        attributes: ['name'],
                        through: { attributes: [] },
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }

        } else {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }

        res.status(200).json({user: user});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(400).json({ message: 'Token não fornecido' });
        }
        const decoded = jwt.verify(token, process.env.JWT_Secret);
        const { user_id, id } = decoded;

        const { name, email } = req.body;

        let user;

        if (user_id) {
            user = await User.findOne({ where: { user_id } });
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
        }
        else if (id) {
            user = await PostOfficeUser.findOne({ where: { post_office_user_id: id } });
            if (!user) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
        } else {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }

        await user.update({ name, email });

        res.status(200).json({
            message: 'Perfil atualizado com sucesso',
            profile: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(400).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_Secret);

        const { oldPassword, newPassword } = req.body;

        let user;

        if (decoded.user_id) {
            user = await User.findOne({ where: { user_id: decoded.user_id } });
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
        }
        else if (decoded.id) {
            user = await PostOfficeUser.findOne({ where: { post_office_user_id: decoded.id } });
            if (!user) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
        } else {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha atual incorreta' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await user.update({ password: hashedNewPassword });

        res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao alterar senha' });
    }
};

exports.getAddresses = async (req, res) => {
    try {
        let ownerId, ownerType;

        if (req.userType === 'user') {
            ownerId = req.user.user_id;
            ownerType = 'user';
        } else if (req.userType === 'post_office') {
            ownerId = req.user.post_office_id;
            ownerType = 'post_office';
        } else {
            return res.status(403).json({ message: 'Tipo de usuário inválido' });
        }

        const addresses = await Address.findAll({
            where: { owner_id: ownerId, owner_type: ownerType }
        });

        if (!addresses || addresses.length === 0) {
            return res.status(404).json({ message: 'Nenhum endereço encontrado' });
        }

        return res.status(200).json({ addresses: addresses });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter endereços' });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const { street, door_number, floor_number, city_id } = req.body;
        let owner_id, owner_type;

        if (req.userType === 'post_office') {
            owner_id = req.user.post_office_id;
            owner_type = 'post_office';
        } else {
            owner_id = req.user.user_id;
            owner_type = 'user';
        }

        const address = await Address.create({
            street,
            door_number,
            floor_number,
            city_id,
            owner_id,
            owner_type
        });

        res.status(201).json({ message: 'Endereço adicionado com sucesso', address });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar endereço' });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        let ownerId, ownerType;

        if (req.userType === 'user') {
            ownerId = req.user.user_id;
            ownerType = 'user';
        } else if (req.userType === 'post_office') {
            ownerId = req.user.post_office_id;
            ownerType = 'post_office';
        } else {
            return res.status(403).json({ message: 'Tipo de usuário inválido' });
        }

        const { id: addressId } = req.params;
        const { street, door_number, floor_number, city_id } = req.body;

        const address = await Address.findOne({
            where: { address_id: addressId, owner_id: ownerId, owner_type: ownerType }
        });

        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado ou não pertence a você' });
        }

        await address.update({ street, door_number, floor_number, city_id });

        res.status(200).json({
            message: 'Endereço atualizado com sucesso',
            address
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar endereço' });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        let ownerId, ownerType;

        if (req.userType === 'user') {
            ownerId = req.user.user_id;
            ownerType = 'user';
        } else if (req.userType === 'post_office') {
            ownerId = req.user.post_office_id;
            ownerType = 'post_office';
        } else {
            return res.status(403).json({ message: 'Tipo de usuário inválido' });
        }

        const { id: addressId } = req.params;

        const address = await Address.findOne({
            where: { address_id: addressId, owner_id: ownerId, owner_type: ownerType }
        });

        if (!address) {
            return res.status(404).json({ message: 'Endereço não encontrado ou não pertence a você' });
        }

        const user = await User.findOne({
            where: { address_id: addressId }
        });

        if (user) {
            user.address_id = null;
            await user.save();
        }

        await address.destroy();

        res.status(200).json({ message: 'Endereço removido com sucesso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover endereço' });
    }
};

exports.getPostOffice = async (req, res) => {

    try {
        const postOfficesId = req.params.id;

        const postOffice = await PostOffice.findOne({
            attributes: ['post_office_id', 'name', 'coverage_area', 'fee', 'is_active'],
            where: {
                post_office_id: postOfficesId, 
                is_active: 1 
            }
        });

        if (!postOffice) {
            return res.status(404).json({ message: 'Posto de correios não encontrado ou inativo' });
        }

        res.status(200).json({ postOffice: postOffice});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar informações do posto de correios' });
    }
};

exports.updateProfilePicture = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (user.profile_picture) {
            const oldImagePath = path.join(__dirname, '..', 'uploads/profile_pictures', user.profile_picture);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        user.profile_picture = req.file.filename;
        await user.save();

        res.status(200).json({ message: 'Imagem de perfil atualizada com sucesso!', profile_picture: user.profile_picture });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar a imagem de perfil.' });
    }
};
