const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const { User, ClientUserData, SystemAdminData, PostalCompanyAdminData, PostalCompanyEmployeeData, PostalCompany, PhoneOwnerType, AdminUserData, PostOfficeAdminData, PostOfficeEmployeeData, UserType, PhoneNumber, Address, UserAddress, PostOffice, CommonUserData, PostOfficeUser, PostOfficeUserType, UserRole, PostOfficeUserRoles, PhoneOwner } = require('../../models');
const { sendResetPasswordEmail } = require('../services/emailService');
const { Op } = require('sequelize');

const blacklistedTokens = require('../../utils/tokenBlacklist');

//falta:
//estes estão escaláveis? seguem boas práticas?
//logica de forgot password e reset password


exports.register = async (req, res) => {
    try {
        const { nif, name, surname, email, password, phone_number, country_id, street, door_number, floor_number} = req.body;//phone_number, phone_number_code, street, door_number, floor_number, city_id 

        let user = await User.findOne({ where: { email } });

        if (user) {
            const existingRole = await UserRole.findOne({ where: { user_id: user.user_id, user_type_name: "client" } });

            if (existingRole) {
                return res.status(400).json({ message: "Usuário já é um cliente!" });
            }

            await UserRole.create({
                user_id: user.user_id,
                user_type_name: "client",
            });

            await ClientUserData.create({
              user_id: user.user_id,
              nif,
          });

            return res.status(201).json({ message: "Usuário atualizado para cliente com sucesso!" });
        }

        const existingNif = await ClientUserData.findOne({ where: { nif } });
        if (existingNif) return res.status(400).json({ message: 'Usuário com este NIF já existe' });


        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({ name, surname, email, password: hashedPassword , profile_picture_id: 1, country_id, is_active:true});

        await UserRole.create({
            user_id: user.user_id,
            user_type_name: "client",
        });

        const phoneNumber = await PhoneNumber.create({
          phone_number,
          country_id,//não esta ligado na bd nem modelo e tabela ñ existe ainda
          user_id: user.user_id,
          //necessários c e u aqui?
          created_at: new Date(),
          updated_at: new Date(),
        });

        const address = await Address.create({
            street,
            door_number,
            floor_number,
            //city_id, //ñ existe ainda
            is_active: true//configurar em modelo //ou deixar aqui🤔
        });

        await UserAddress.create({
          user_id: user.user_id,
          address_id: address.address_id,
          //necessários c e u aqui?
          created_at: new Date(),
          updated_at: new Date(),
      });

        await ClientUserData.create({
            user_id: user.user_id,
            address_id: address.address_id,
            phone_number_id: phoneNumber.phone_number_id,
            nif,
        });

        const userResponse = user.toJSON();
        delete userResponse.password;
        delete userResponse.is_active;

        //melhor funçã? segue Bpraticas, resposta(...)🤔
        //colocar validação de dados em backend ou fend?

        res.status(201).json({ message: 'Usuario registrado com sucesso', user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no Servidor' })
    }
};


exports.registerAdmin = async (req, res) => {
  try {
    //e a logica de password temporária?
    const { name, surname, email, password, created_by } = req.body;

    // Verifica se já existe um usuário com este email
    let existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      // Verifica se já é admin
      const userRoles = await UserRole.findOne({
        where: { user_id: existingUser.user_id, user_type_name: 'system_admin' },//colocar os tipos direto aqui ou utilizar utils?
      });

      if (userRoles) {
        return res.status(400).json({ message: 'Este usuário já é um administrador!' });
      }

      // Se não for admin ainda, associar o papel admin
      await UserRole.create({
        user_id: existingUser.user_id,
        user_type_name: 'system_admin',
      });

      // Cria o registro específico de dados de admin
      await SystemAdminData.create({
        user_id: existingUser.user_id,
        created_by: created_by || null,//fazer logica automatica para guardar created_by? em file é created bu user id padronizar com msm nome?🤔
      });

    } else {
      // Criação do novo usuário admin
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        surname,
        email,
        password: hashedPassword,
        profile_picture_id: 1,//colocado diretamente mas e se mudar id em BD?
        is_active: true,
      });

      await UserRole.create({
        user_id: newUser.user_id,
        user_type_name: 'system_admin',
      });

      await SystemAdminData.create({
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

exports.registerPostalCompanyWithAdmin = async (req, res) => {
  //melhor abordagem? melhor funções separadas?
  try {
    const {
      name: companyName,
      country_id,
      email,
      admin_name,
      admin_surname,
      admin_email,
      admin_password,
      phone_number,
      nif,
    } = req.body;

    // Verificar se já existe um utilizador com o mesmo email
    const existingUser = await User.findOne({ where: { email: admin_email } });
    if (existingUser) return res.status(400).json({ message: "Email já cadastrado" });//respostas em portugues?

    // Verificar se já existe um correio com o mesmo NIF
    const existingCompany = await PostalCompany.findOne({ where: { nif } });
    if (existingCompany) {
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

    // Criar o Correio
    const postalCompany = await PostalCompany.create({
        name: companyName,
        email,
        country_id,
        logotype_id: 2,
        nif,
        is_active: false,
    });

    // Relacionar telefone com o correio
    const phoneNumber = await PhoneNumber.create({
      phone_number,
      country_id,
      postal_company_id: postalCompany.postal_company_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Atualizar postalCompany com o ID do número de telefone criado
    await postalCompany.update({
      phone_number_id: phoneNumber.phone_number_id,
    });

    // Inserir os dados específicos do administrador de correio
    await PostalCompanyAdminData.create({
        user_id: user.user_id,
        postal_company_id: postalCompany.postal_company_id,
    });

    // Atribuir o tipo de utilizador "post_office_admin"
    const userType = await UserType.findOne({ where: { name: 'postal_company_admin' } });

    if (!userType) {
      return res.status(400).json({ message: 'Tipo de usuário inválido' });
    }

    await UserRole.create({
      user_id: user.user_id,
      user_type_name: userType.name,
    });

    const { password, ...userWithoutPassword } = user.toJSON();//msm necessário user without pass? tem outra forma mais elegante?

    res.status(201).json({
      message: "Correio e Administrador registrados com sucesso! Aguardando aprovação do administrador geral.",
      postalCompany,
      admin: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar Correio e Administrador!" });
  }
};

exports.registerPostalCompanyUser = async (req, res) => {
  try {
    const {name,surname,email,password,postal_company_id, post_office_id, role = 'postal_company_employee', 
} = req.body; //é melhor role ou type? e se mais de um type?apanha mesmo o primeiro?

    // Validação dos campos obrigatórios
    if (!email || !password || !postal_company_id || !role || !name || !surname) {
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
      //createdby //faltando logica de password temporaria e created by
      is_active: true,
    });

    // Verifica se o tipo de usuário é válido
    const validRoles = ['postal_company_admin', 'postal_company_employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Tipo de usuário inválido. Deve ser postOfficeAdmin ou postOfficeEmployee.' });
    }

    // Associa o tipo ao usuário
    await UserRole.create({
      user_id: user.user_id,
      user_type_name: role,
    });

    // Insere os dados específicos do funcionário ou administrador do correio
    if (role === 'postal_company_admin') {
      await PostalCompanyAdminData.create({
        user_id: user.user_id,
        postal_company_id,
      });
    } else if (role === 'postal_company_employee') {
      await PostalCompanyEmployeeData.create({
        user_id: user.user_id,
        postal_company_id,
        post_office_id,
      });
    }

    // Remove a senha antes de retornar os dados
    const { password: _, ...userData } = user.toJSON();

    return res.status(201).json({
      message: `Usuário ${role === 'postal_company_admin' ? 'Administrador' : 'Funcionário'} do Correio registrado com sucesso`,
      user: userData,
      role,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor ao registrar usuário do correio.' });
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
        include: [{ model: UserType, as: 'user_type' }]
      }]
    });

    if (!user) return res.status(400).json({ message: 'Utilizador não encontrado' });

    // 2. Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

    // 3. Verificar se está ativo
    if (!user.is_active) return res.status(403).json({ message: 'Utilizador desativado' });

    // 4. Verificar o tipo do utilizador
    //const roles = user.roles.map(r => r.user_type);
    //const userType = roles.length > 0 ? roles[0] : 'unknown'; // pode ter múltiplos papéis//pega todos estes papeis? se não qual deles escolhe? o primeiro?

    // 4. Coletar todos os papéis (roles)
    const roles = user.roles.map(r => r.user_type?.name);

    // 5. Dados adicionais (ex: post_office_id se for funcionário ou admin de correio)
    // let additionalData = null;

    
    // if (userType === 'postal_company_employee') {
    //     additionalData = await PostalCompanyEmployeeData.findOne({ where: { user_id: user.user_id } });
    // } else if (userType === 'postal_company_admin') {
    //     additionalData = await PostalCompanyAdminData.findOne({ where: { user_id: user.user_id } });
    // }
    // 5. Buscar dados adicionais (se aplicável)
    let postal_company_id = null;
    let post_office_id = null;

    // Se tiver um dos papéis relacionados a empresa postal
    if (roles.includes('postal_company_employee')) {
      const data = await PostalCompanyEmployeeData.findOne({ where: { user_id: user.user_id } });
      if (data) {
        postal_company_id = data.postal_company_id;
        post_office_id = data.post_office_id;
      }
    } else if (roles.includes('postal_company_admin')) {
      const data = await PostalCompanyAdminData.findOne({ where: { user_id: user.user_id } });
      if (data) {
        postal_company_id = data.postal_company_id;
      }
    }

    // 6. Gerar token JWT
    // const token = jwt.sign(
    //   {
    //     user_id: user.user_id,
    //     email: user.email,
    //     role: userType.name,
    //     //estes aparecem no token (como null) mesmo nos que não tem , é o ideal?
    //     postal_company_id: additionalData ? additionalData.postal_company_id : null,
    //     post_office_id: additionalData ? additionalData.post_office_id : null,
    //   },
    //   process.env.JWT_Secret,
    //   { expiresIn: '1h' }
    // );

    // 6. Gerar token JWT com array de roles
    const tokenPayload = {
      user_id: user.user_id,
      email: user.email,
      roles, // <-- agora é um array!
      ...(postal_company_id && { postal_company_id }),
      ...(post_office_id && { post_office_id }),
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_Secret, { expiresIn: '1h' });


    // 7. Retornar token
    return res.status(200).json({ token });//padronizar respostas exercer boasprat

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

//função desatualizada, fazer função final
exports.logout = (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(400).json({ message: "Token não fornecido" });

    blacklistedTokens.add(token);
    res.status(200).json({ message: "Logout realizado com sucesso" });
};


//____ de lado por agora
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