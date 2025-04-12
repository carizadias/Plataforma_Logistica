const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const { User, AdminUserData, PostOfficeAdminData, PostOfficeEmployeeData, UserType, PhoneNumber, Address, PostOffice, CommonUserData, PostOfficeUser, PostOfficeUserType, UserRole, PostOfficeUserRoles } = require('../../models');
const { sendResetPasswordEmail } = require('../services/emailService');
const { Op } = require('sequelize');

const blacklistedTokens = require('../../utils/tokenBlacklist');

//falta:
//estes estão escaláveis? seguem boas práticas?
//logica de forgot password e resetpassword


exports.register = async (req, res) => {
    try {
        const { nif, name, surname, email, password, phone_number, phone_number_code, street, door_number, floor_number, city_id } = req.body;

        let user = await User.findOne({ where: { email } });

        if (user) {
            const existingRole = await UserRole.findOne({ where: { user_id: user.user_id, user_type: "common" } });

            if (existingRole) {
                return res.status(400).json({ message: "Usuário já é um utilizador!" });
            }

            await UserRole.create({
                user_id: user.user_id,
                user_type: "common",
            });

            return res.status(201).json({ message: "Usuário atualizado para utilizador com sucesso!" });
        }

        const existingNif = await CommonUserData.findOne({ where: { nif } });
        if (existingNif) return res.status(400).json({ message: 'Usuário com este NIF já existe' });


        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({ nif, name, surname, email, password: hashedPassword , profile_picture_id: 1});

        await UserRole.create({
            user_id: user.user_id,
            user_type: "common",
        });

        const phoneNumber = await PhoneNumber.create({
            phone_number: phone_number,
            phone_number_code: phone_number_code,
            user_id: user.user_id
        });

        const address = await Address.create({
            street,
            door_number,
            floor_number,
            city_id,
            owner_id: user.user_id,
            owner_type: 'user'
        });

        await CommonUserData.create({
            user_id: user.user_id,
            address_id: address.address_id,
            phone_number_id: phoneNumber.phone_number_id,
            nif: nif,
        });

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

    // 1. Encontrar utilizador pelo email
    const user = await User.findOne({
      where: { email },
      include: [{
        model: UserRole,
        as: 'roles',
        include: [{ model: UserType, as: 'type' }]
      }]
    });

    if (!user) return res.status(400).json({ message: 'Utilizador não encontrado' });

    // 2. Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

    // 3. Verificar se está ativo
    if (!user.is_active) return res.status(403).json({ message: 'Utilizador desativado' });

    // 4. Verificar o tipo do utilizador
    const roles = user.roles.map(r => r.user_type);
    const userType = roles.length > 0 ? roles[0] : 'unknown'; // pode ter múltiplos papéis

    // 5. Dados adicionais (ex: post_office_id se for funcionário ou admin de correio)
    let additionalData = null;

    if (userType === 'postOfficeEmployee') {
        additionalData = await PostOfficeEmployeeData.findOne({ where: { user_id: user.user_id } });
    } else if (userType === 'postOfficeAdmin') {
        additionalData = await PostOfficeAdminData.findOne({ where: { user_id: user.user_id } });
    }

    // 6. Gerar token JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: userType,
        post_office_id: additionalData ? additionalData.post_office_id : null,
      },
      process.env.JWT_Secret,
      { expiresIn: '1h' }
    );

    // 7. Retornar token
    return res.status(200).json({ token });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

//acho que não é preciso alterações(por agr)
exports.logout = (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(400).json({ message: "Token não fornecido" });

    blacklistedTokens.add(token);
    res.status(200).json({ message: "Logout realizado com sucesso" });
};

//para todos ou apenas utilizador comum? implementar se admin de correio e funcionário esquecerem passe
exports.forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;

      const commonUserData = await CommonUserData.findOne({
          include: [
              {
                  model: User,
                  as: 'user',
                  where: { email },
                  attributes: ['user_id', 'email']
              }
          ]
      });

      if (!commonUserData) {
          return res.status(404).json({ message: "E-mail não encontrado" });
      }

      const token = crypto.randomBytes(20).toString("hex");
      const expireTime = new Date(Date.now() + 3600000); // 1 hora

      await commonUserData.update({
          resetToken: token,
          resetTokenExpire: expireTime
      });

      await sendResetPasswordEmail(commonUserData.user.email, token);

      res.status(200).json({ message: "Email de recuperação enviado com sucesso" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao processar solicitação" });
  }
};

//e em relação aos outros utilizadores🤔
//também lembrar ao aprovar um correio deveria ser enviada para o correio um email junto com palavra passe que ao entrar o correio deve altarar imediatamente
exports.resetPassword = async (req, res) => {
  try {
      const { token, newPassword } = req.body;

      const commonUserData = await CommonUserData.findOne({
          where: {
              resetToken: token,
              resetTokenExpire: { [Op.gt]: new Date() }
          },
          include: [
              {
                  model: User,
                  as: 'user',
                  attributes: ['user_id', 'password']
              }
          ]
      });

      if (!commonUserData || !commonUserData.user) {
          return res.status(400).json({ message: "Token inválido ou expirado" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await commonUserData.user.update({ password: hashedPassword });
      await commonUserData.update({ resetToken: null, resetTokenExpire: null });

      res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao redefinir senha" });
  }
};


exports.registerAdmin = async (req, res) => {
  try {
    const { name, surname, email, password, created_by } = req.body;

    // Verifica se já existe um usuário com este email
    let existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      // Verifica se já é admin
      const userRoles = await UserRole.findOne({
        where: { user_id: existingUser.user_id, user_type: 'admin' },
      });

      if (userRoles) {
        return res.status(400).json({ message: 'Este usuário já é um administrador!' });
      }

      // Se não for admin ainda, associar o papel admin
      await UserRole.create({
        user_id: existingUser.user_id,
        user_type: 'admin',
      });

      // Cria o registro específico de dados de admin
      await AdminUserData.create({
        user_id: existingUser.user_id,
        created_by: created_by || null,
      });

    } else {
      // Criação do novo usuário admin
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        surname,
        email,
        password: hashedPassword,
        profile_picture_id: 1,
        is_active: true,
      });

      await UserRole.create({
        user_id: newUser.user_id,
        user_type: 'admin',
      });

      await AdminUserData.create({
        user_id: newUser.user_id,
        created_by: created_by || null,
      });

      existingUser = newUser;
    }

    const userAdminResponse = existingUser.toJSON();
    delete userAdminResponse.password;
    delete userAdminResponse.is_active;

    res.status(201).json({ message: 'Admin registrado com sucesso!', userAdminResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar admin! Verifique os dados enviados.' });
  }
};


exports.registerPostOfficeUser = async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      post_office_id,
      role = 'postOfficeEmployee', // agora usamos os nomes exatos das roles
    } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !password || !post_office_id || !role || !name || !surname) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Verifica se o email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hasheia a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const user = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
      profile_picture_id: 1, // Padrão
      is_active: true,
    });

    // Verifica se o tipo de usuário é válido
    const validRoles = ['postOfficeAdmin', 'postOfficeEmployee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Tipo de usuário inválido. Deve ser postOfficeAdmin ou postOfficeEmployee.' });
    }

    // Associa o tipo ao usuário
    await UserRole.create({
      user_id: user.user_id,
      user_type: role,
    });

    // Insere os dados específicos do funcionário ou administrador do correio
    if (role === 'postOfficeAdmin') {
      await PostOfficeAdminData.create({
        user_id: user.user_id,
        post_office_id,
      });
    } else if (role === 'postOfficeEmployee') {
      await PostOfficeEmployeeData.create({
        user_id: user.user_id,
        post_office_id,
      });
    }

    // Remove a senha antes de retornar os dados
    const { password: _, ...userData } = user.toJSON();

    return res.status(201).json({
      message: `Usuário ${role === 'postOfficeAdmin' ? 'Administrador' : 'Funcionário'} do Correio registrado com sucesso`,
      user: userData,
      role,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor ao registrar usuário do correio.' });
  }
};


exports.registerPostOfficeWithAdmin = async (req, res) => {
  try {
    const {
      name: postOfficeName,
      country_id,
      admin_name,
      admin_surname,
      admin_email,
      admin_password,
      phone_number,
      phone_number_code,
      nif,
    } = req.body;

    // Verificar se já existe um utilizador com o mesmo email
    const existingUser = await User.findOne({ where: { email: admin_email } });
    if (existingUser) return res.status(400).json({ message: "Email já cadastrado" });

    // Verificar se já existe um correio com o mesmo NIF
    const existingPostOffice = await PostOffice.findOne({ where: { nif } });
    if (existingPostOffice) {
        return res.status(400).json({ message: "Já existe um Correio com este NIF" });
    }

    // Verificar se o número de telefone já existe, se não, criar um novo
    //const phoneNumber = await PhoneNumber.findOne({ where: { phone_number: phone_number } });

    // Hashear a senha
    const hashedPassword = await bcrypt.hash(admin_password, 10);

    // Criar o utilizador (admin)
    const user = await User.create({
      name: admin_name,
      surname: admin_surname,
      email: admin_email,
      password: hashedPassword,
      profile_picture_id: 1, // Foto de perfil do administrador
      is_active: false, // Ainda não aprovado
    });

    // Criar e associar o número de telefone ao usuário
    const createdPhoneNumber = await PhoneNumber.create({
        user_id: user.user_id,
        phone_number,
        phone_number_code,
    });

    // Criar o Correio
    const postOffice = await PostOffice.create({
        name: postOfficeName,
        country_id,
        profile_picture: 2,
        nif,
        phone_number_id: createdPhoneNumber.phone_number_id,
        is_active: false,
    });

    // Inserir os dados específicos do administrador de correio
    await PostOfficeAdminData.create({
        user_id: user.user_id,
        post_office_id: postOffice.post_office_id,
    });

    // Atribuir o tipo de utilizador "post_office_admin"
    const userType = await UserType.findOne({ where: { name: 'postOfficeAdmin' } });

    if (!userType) {
      return res.status(400).json({ message: 'Tipo de usuário inválido' });
    }

    await UserRole.create({
      user_id: user.user_id,
      user_type: userType.name,
    });

    const { password, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      message: "Correio e Administrador registrados com sucesso! Aguardando aprovação do administrador geral.",
      postOffice,
      admin: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar Correio e Administrador!" });
  }
};
