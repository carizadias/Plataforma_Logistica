const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const { User, PhoneNumber, Address, PostOffice, PostOfficeUser, PostOfficeUserType, UserRoles, PostOfficeUserRoles } = require('../../models');
const { sendResetPasswordEmail } = require('../services/emailService');
const { Op } = require('sequelize');

const blacklistedTokens = require('../../utils/tokenBlacklist');




exports.register = async (req, res) => {
    try {
        const { nif, name, surname, email, password, phone_number, phone_number_code, street, door_number, floor_number, city_id } = req.body;

        let user = await User.findOne({ where: { email } });

        if (user) {
            const existingRole = await UserRoles.findOne({ where: { user_id: user.user_id, user_type: "user" } });

            if (existingRole) {
                return res.status(400).json({ message: "Usuário já é um utilizador!" });
            }

            await UserRoles.create({
                user_id: user.user_id,
                user_type: "user",
            });

            return res.status(201).json({ message: "Usuário atualizado para utilizador com sucesso!" });
        }

        user = await User.findOne({ where: { nif } });
        if (user) return res.status(400).json({ message: 'Usuário  com este nif já existe' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({ nif, name, surname, email, password: hashedPassword });

        await UserRoles.create({
            user_id: user.user_id,
            user_type: "user",
        });

        const phoneNumber = await PhoneNumber.create({
            phone_number: phone_number,
            phone_number_code: phone_number_code,
            user_id: user.user_id
        });

        user.phone_number_id = phoneNumber.phone_number_id;
        await user.save();

        const address = await Address.create({
            street,
            door_number,
            floor_number,
            city_id,
            owner_id: user.user_id,
            owner_type: 'user'
        });

        user.address_id = address.address_id;
        await user.save();

        const userResponse = user.toJSON();
        delete userResponse.password;
        delete userResponse.is_active;

        res.status(201).json({ message: 'Usuario registrado com sucesso', user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no Servidor' })
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Usuario não encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        const userRole = await UserRoles.findOne({ where: { user_id: user.user_id } });
        const userType = userRole ? userRole.user_type : 'user';

        const token = jwt.sign(
            { user_id: user.user_id, nif: user.nif, type: userType },
            process.env.JWT_Secret,
            { expiresIn: '1h' }
        );
        res.status(200).json({token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};

exports.logout = (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(400).json({ message: "Token não fornecido" });

    blacklistedTokens.add(token);
    res.status(200).json({ message: "Logout realizado com sucesso" });
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "E-mail não encontrado" });

        const token = crypto.randomBytes(20).toString("hex");
        const expireTime = new Date(Date.now() + 3600000);

        await user.update({ resetToken: token, resetTokenExpire: expireTime });

        await sendResetPasswordEmail(email, token);

        res.status(200).json({ message: "Email de recuperação enviado com sucesso", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao processar solicitação" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpire: { [Op.gt]: new Date() },
            },
        });

        if (!user) return res.status(400).json({ message: "Token inválido ou expirado" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await user.update({ password: hashedPassword, resetToken: null, resetTokenExpire: null });

        res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao redifinir senha" });
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const { nif, name, surname, email, password } = req.body;

        let existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { nif }] } });


        if (existingUser) {
            if (existingUser.nif === nif) {
                return res.status(400).json({ message: 'Este NIF já está cadastrado para outro usuário!' });
            }
            const userRoles = await UserRoles.findOne({ where: { user_id: existingUser.user_id, user_type: 'admin' } });
            if (userRoles) {
                return res.status(400).json({ message: 'Este usuário já é um administrador!' });
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser = await User.create({
                nif,
                name,
                surname,
                email,
                password: hashedPassword,
                is_active: true,
            });
        }

        await UserRoles.create({
            user_id: existingUser.user_id,
            user_type: "admin", 
        });

        const userAdminResponse = existingUser.toJSON();
        delete userAdminResponse.password;
        delete userAdminResponse.is_active;

        res.status(201).json({ message: 'Admin registrado com sucesso!', userAdminResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar admin! Verifique se o token não está expirado' });
    }
};

exports.registerPostOfficeUser = async (req, res) => {
    try {
        const { email, password, post_office_id, role = 'employee' } = req.body; 

        if (!email || !password || !post_office_id || !role) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }
        const existingUser = await PostOfficeUser.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email já cadastrado' });

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser = await PostOfficeUser.create({
            email,
            password: hashedPassword,
            post_office_id,
            is_active: true
        });

        const validRoles = ['admin', 'employee']; 

        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Tipo de usuário inválido. Deve ser admin ou employee.' });
        }

        const postOfficeUserType = await PostOfficeUserType.findOne({ where: { name: role } });

        if (!postOfficeUserType) {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }

        await PostOfficeUserRoles.create({
            post_office_user_id: newUser.post_office_user_id,
            post_office_user_type_id: postOfficeUserType.post_office_user_type_id
        });

        newUser = newUser.toJSON(); 
        delete newUser.password;
        delete newUser.createdAt;
        delete newUser.updatedAt;

        res.status(201).json({ message: 'Usuário do Correio registrado com sucesso', newUser, role: postOfficeUserType.name });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};

exports.registerPostOfficeWithAdmin = async (req, res) => {
    try {
        const { name, country_id, coverage_area, fee, admin_email, admin_password } = req.body;

        const existingUser = await PostOfficeUser.findOne({ where: { email: admin_email } });
        if (existingUser) return res.status(400).json({ message: "Email já cadastrado" });

        const postOffice = await PostOffice.create({
            name,
            country_id,
            coverage_area,
            fee,
            is_active: false,
        });

        const hashedPassword = await bcrypt.hash(admin_password, 10);

        const postOfficeAdmin = await PostOfficeUser.create({
            email: admin_email,
            password: hashedPassword,
            post_office_id: postOffice.post_office_id,
            is_active: false,
        });

        const userType = await PostOfficeUserType.findOne({ where: { name: 'admin' } });

        if (!userType) {
            return res.status(400).json({ message: 'Tipo de usuário inválido' });
        }

        await PostOfficeUserRoles.create({
            post_office_user_id: postOfficeAdmin.post_office_user_id,
            post_office_user_type_id: userType.post_office_user_type_id
        });

        const { password, ...adminWithoutPassword } = postOfficeAdmin.toJSON();

        res.status(201).json({
            message: "Correio e Administrador registrados com sucesso! Aguardando aprovação do administrador geral.",
            postOffice,
            postOfficeAdmin: adminWithoutPassword,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao registrar Correio e Administrador!" });
    }
};

exports.loginPostOffice = async (req, res) => {
    try {
        const { email, password } = req.body;

        const postOfficeUser = await PostOfficeUser.findOne({
            where: { email },
            include: {
                model: PostOfficeUserType, 
                through: { attributes: [] },
                as: 'roles'
            }
        });

        if (!postOfficeUser) return res.status(400).json({ message: 'Usuário do Correio não encontrado' });

        const isMatch = await bcrypt.compare(password, postOfficeUser.password);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        if (!postOfficeUser.is_active) {
            return res.status(403).json({ message: 'Utilizador não esta validado' });
        }

        const userRole = postOfficeUser.roles.length > 0 ? postOfficeUser.roles[0].name : 'employee';

        const token = jwt.sign(
            { id: postOfficeUser.post_office_user_id, post_office_id: postOfficeUser.post_office_id, role: userRole },
            process.env.JWT_Secret,
            { expiresIn: '1h' }
        );

        res.status(200).json({token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};
