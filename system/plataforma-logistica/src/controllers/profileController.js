const bcrypt = require('bcryptjs');
const { User, Address, File, PostalCompany, PhoneNumber, ClientUserData, SystemAdminData, PostalCompanyAdminData, PostalCompanyEmployeeData, PostOffice, UserType, UserRole } = require('../../models');
const getUserModelByType = require('../../utils/getUserModelByType')
const { handleFileUpload } = require('../../utils/uploadUtils');

//em que funções pegar id de postal company e admin? ou de responsavel?

exports.getProfile = async (req, res) => {
  try {

    const user_id = req.user.user_id;//melhor userId

    const user = await User.findOne({
      where: { user_id },
      include: [
        {
          model: UserRole,
          as: 'roles',//deixar types para ficar mais claro🤔
          include: [{ model: UserType, as: 'user_type' }]
        }
      ]
    });

    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });

    // 3. Verificar o tipo de utilizador e buscar dados específicos
    const roles = user.roles.map(r => r.user_type);
    const userType = roles.length > 0 ? roles[0] : 'unknown'; // Pega o primeiro tipo de papel(é a melhor logica?)


    const profile = {
      user: {
        user_id: user.user_id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        is_active: user.is_active,
        profile_picture_id: user.profile_picture_id,
      },
      user_type: userType,
      //      additional_data: additionalData || null,
    };

    return res.status(200).json(profile);

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar perfil' });
  }
};

exports.getClientProfile = async (req, res) => {
  try {

    const user_id = req.user.user_id;

    const additionalData = await ClientUserData.findOne({ where: { user_id } });
    if (!additionalData) return res.status(404).json({ message: 'Dados adicionais não encontrados' });

    return res.status(200).json({ additional_data: additionalData });

  } catch (error) {
    console.error('Erro ao buscar dados adicionais:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};

exports.getSystemAdminProfile = async (req, res) => {
  try {

    const user_id = req.user.user_id;

    const additionalData = await SystemAdminData.findOne({ where: { user_id } });
    if (!additionalData) return res.status(404).json({ message: 'Dados adicionais não encontrados' });

    return res.status(200).json({ additional_data: additionalData });

  } catch (error) {
    console.error('Erro ao buscar dados adicionais:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};

exports.getPostalCompanyAdminProfile = async (req, res) => {
  try {

    const user_id = req.user.user_id;

    const additionalData = await PostalCompanyAdminData.findOne({ where: { user_id } });
    if (!additionalData) return res.status(404).json({ message: 'Dados adicionais não encontrados' });

    return res.status(200).json({ additional_data: additionalData });

  } catch (error) {
    console.error('Erro ao buscar dados adicionais:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};

exports.getPostalCompanyEmployeeProfile = async (req, res) => {
  try {

    const user_id = req.user.user_id;

    const additionalData = await PostalCompanyEmployeeData.findOne({ where: { user_id } });
    if (!additionalData) return res.status(404).json({ message: 'Dados adicionais não encontrados' });

    return res.status(200).json({ additional_data: additionalData });

  } catch (error) {
    console.error('Erro ao buscar dados adicionais:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};

exports.updateProfile = async (req, res) => {
  try {

    const userId = req.user.user_id;
    // Encontrar o usuário
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
      // Encontrar os dados específicos do usuário com base no seu tipo de usuário
      const userType = await UserRole.findOne({
        where: { user_id: userId },
        include: [{ model: UserType, as: 'user_type' }],
      });

      console.log("userType:" + userType)

      if (!userType || !userType.user_type) {
        return res.status(400).json({ message: 'Tipo de usuário não encontrado' });
      }

      const type = userType.user_type.name;

      // Obter o modelo específico com base no tipo
      const SpecificModel = getUserModelByType(type);//fazer tambem função (util) getType ou deixr pra pegar no token?🤔
      if (!SpecificModel) {
        return res.status(400).json({ message: 'Tipo de usuário inválido' });
      }
      console.log("specificModel:" + SpecificModel)

      // Atualizar os dados do usuário
      const { name, surname, email, userData } = req.body;

      if (!name && !surname && !email && !password && (!userData || Object.keys(userData).length === 0)) {
        return res.status(400).json({ message: 'Nenhum dado enviado para atualização.' });
      }
      

      // Atualizar os dados comuns do usuário
      user.name = name || user.name;
      user.surname = surname || user.surname;
      user.email = email || user.email;

      // Atualizar os dados específicos do usuário      
      if (userData && Object.keys(userData).length > 0) {
        await SpecificModel.update(userData, { where: { user_id: userId } });
      }

      await user.save();//save é melhor prática

      return res.status(200).json({ message: 'Perfil atualizado com sucesso' });//mostrar atualização?
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

//diferenças para updates de tipos deutilizadores🤔, mais tarde talvez..
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias.' });
    }

    // Buscar o usuário
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se a senha atual está correta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    // Atualizar a senha
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: 'Senha atualizada com sucesso.' });

  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar a senha.' });
  }
};

exports.updateUserProfilePicture = async (req, res) => {
  try {

    const userId = req.user.user_id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    const newFile = await handleFileUpload(req);

    user.profile_picture_id = newFile.file_id;
    await user.save();

    return res.status(200).json({
      message: 'Foto de perfil atualizada com sucesso',
      picture: {
        file_id: newFile.file_id,
        url: newFile.url
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || 'Erro ao atualizar foto de perfil' });
  }
};

exports.getAllPostOfficesByPostalCompanyId = async (req, res) =>{
  try {
    const postalCompanyId = req.user.postal_company_id;
    console.log(postalCompanyId)
    const postOffices = await PostOffice.findAll({
      where: {postal_company_id: postalCompanyId}
    }); 

    return res.json({postOffices});
  } catch (error) {
    console.error('Erro ao buscar Post Offices:', error);
    throw new Error('Erro ao buscar Post Offices');
  }
};

//mostrar mais ao cliente?🤔
exports.getPostalCompanyPublicProfile = async (req, res) => {
  try {
    const postalCompanyId = req.params.postalCompanyId;

    const postalCompany = await PostalCompany.findByPk(postalCompanyId, {
      attributes: ['postal_company_id', 'name', 'email', 'nif'],//se é public não precisa de isactive
      include: [
        {
          model: File,
          as: 'logotype',
          attributes: ['url'],
        },
        {
          model: PostOffice,
          as: 'post_offices',
          attributes: ['post_office_id', 'name', 'photo_id'] // Retorna apenas o necessário para o frontend
          
        }
      ]
    });

    if (!postalCompany) {
      return res.status(404).json({ message: 'Postal Company não encontrada' });
    }

    //buscar números associados
    //atualizar agr apenas phone number
    const phoneNumbers = await PhoneNumber.findAll({
      where: {postal_company_id: postalCompanyId},
      attributes:['phone_number']
    });

    console.log(phoneNumbers)

    return res.status(200).json({ profile: postalCompany , phone_contacts: phoneNumbers});// phone_contacts: phoneOwners
  } catch (error) {
    console.error('Erro ao obter perfil público da postal company:', error);
    return res.status(500).json({ message: 'Erro interno ao obter perfil' });
  }
};

//mostrar mais ou menos a administrador?🤔
exports.getPostalCompanyPrivateProfile = async (req, res) => {
  try {
    const postalCompanyId = req.params.postalCompanyId;

    const postalCompany = await PostalCompany.findByPk(postalCompanyId, {
      attributes: [
        'postal_company_id',
        'name',
        'email',
        'nif',
      ],
      include: [
        {
          model: File,
          as: 'logotype',
          attributes: ['file_id']
        },
        {
          model: PostOffice,
          as: 'post_offices',
          attributes: [
            'post_office_id',
            'name',
            'email',
          ],
          include: [
            {
              model: File,
              as: 'photo',
              attributes: ['file_id']
            }
          ]
        }
      ]
    });

    if (!postalCompany) {
      return res.status(404).json({ message: 'Postal Company não encontrada' });
    }

    return res.status(200).json({
      profile: postalCompany,
    });

  } catch (error) {
    console.error('Erro ao obter perfil privado da postal company:', error);
    return res.status(500).json({ message: 'Erro interno ao obter perfil' });
  }
};

//colocar phonenumbers em resposta?🤔
//da erro de duplicação se colocar dados anteriores..
exports.updatePostalCompany = async (req, res) => {
  try {
    const { name, email, nif, phone_numbers} = req.body;
    const postalCompanyId = req.user.postal_company_id;//o administrador só pode atualizar dados de sua propria empresa

    const postalCompany = await PostalCompany.findByPk(postalCompanyId);

    if (!postalCompany) {
      return res.status(404).json({ message: 'Postal Company não encontrada' });
    }

    await postalCompany.update({
      name,
      email,
      nif,
    });

    // 3. Atualiza os números de telefone
    if (Array.isArray(phone_numbers)) {
      // Remove antigos
      await PhoneNumber.destroy({
        where: { postal_company_id: postalCompanyId }
      });

      // Adiciona novos
      const phoneNumberRecords = phone_numbers.map(number => ({
        phone_number: number,
        postal_company_id: postalCompanyId
      }));

      await PhoneNumber.bulkCreate(phoneNumberRecords);
    }

    return res.status(200).json({ message: 'Dados atualizados com sucesso', postalCompany });
  } catch (error) {
    console.error('Erro ao atualizar dados da postal company:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar postal company' });
  }
};

//funciona mas demora um pouco porquê?🤔
exports.updatePostalCompanyLogotype = async (req, res) => {
  try {
    console.log('file:'+req.file.fieldname)
    const postalCompanyId = req.user.postal_company_id;

    const postalCompany = await PostalCompany.findByPk(postalCompanyId);
    if (!postalCompany) {
      return res.status(404).json({ message: 'Postal Company não encontrada' });
    }

    const newFile = await handleFileUpload(req);

    // Atualizar o logotipo na tabela PostalCompany
    postalCompany.logotype_id = newFile.file_id;
    await postalCompany.save();

    return res.status(200).json({
      message: 'Logotipo atualizado com sucesso',
      logotype: {
        file_id: newFile.file_id,
        url: newFile.url
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar logotipo:', error);
    return res.status(error.status || 500).json({ message: error.message || 'Erro interno' });
  }
};

exports.getClientPublicProfile = async (req, res) => {
  try {
    //pegar user id de que busca? pra saber quem qt vezes viu profile?🤔
    const { id } = req.params;

    // Buscar dados completos do usuário para exibição do perfil
    const clientUserData = await ClientUserData.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'surname', 'email', 'profile_picture_id'],
          include: [
            {
              model: Address,
              as: 'addresses',  // Exibindo o endereço completo
              attributes: ['street', 'floor_number', 'door_number', 'city_id']
            },
            {
              model: PhoneNumber,
              as: 'phone_numbers',  // Exibindo o telefone completo
              attributes: ['phone_number']
            }
          ]
        },
      ]
    });

    if (!clientUserData || !clientUserData.user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { name, surname, email, profile_picture_id, addresses, phone_numbers } = clientUserData.user;
    //const address = clientUserData.addresses;
    //const phoneNumber = clientUserData.phone_numbers;

    // Retornar todos os dados para exibir o perfil completo
    res.status(200).json({
      user: {
        name,
        surname,
        email,
        profile_picture_id,
        addresses,
        phone_numbers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
  }
};
