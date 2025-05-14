const bcrypt = require('bcryptjs');
const { PostOfficeHours, User, Address, File, PhoneOwner, PhoneOwnerType, PostalCompany, PhoneNumber, ProfilePicture, ClientUserData, SystemAdminData, PostalCompanyAdminData, PostalCompanyEmployeeData, UserAddress, PostOfficeUser, PostOfficeUserType, PostOffice, UserType, UserRole, CommonUserData, AdminUserData, PostOfficeAdminData, PostOfficeEmployeeData } = require('../../models');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { type } = require('os');
const getUserModelByType = require('../../utils/getUserModelByType')
const postOfficeService = require('../services/postOfficeService');
const upload = require('../services/uploadService');
const sequelize = require('../config/database');
const { handleFileUpload } = require('../../utils/uploadUtils');
const { url } = require('inspector');
const { DEFAULT_POST_OFFICE_PHOTO } = require('../constants/fileTags');
const { where } = require('sequelize');

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

exports.getAddresses = async (req, res) => {
  try {

    const userId = req.user.user_id;

      const user = await User.findOne({
        where: { user_id: userId },
        include: [{
          model: Address,
          as: 'addresses',
          attributes: ['address_id', 'street', 'door_number', 'floor_number', 'city_id'],
          through: { attributes: [] }
        }]
      });

      //console.log(user);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).json({ addresses: user.addresses });

  } catch (error) {
    console.error('Erro ao obter endereços:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar endereços' });
  }
};

exports.getPostOfficeAddress = async (req, res) => {
  try {

    const postOfficeId = req.params.postOfficeId;
    const postalCompanyId = req.user.postal_company_id;

    const postOffice = await PostOffice.findOne({
      where: { post_office_id: postOfficeId, postal_company_id: postalCompanyId },
      include: [{
        model: Address,
        as: 'address',
        attributes: ['address_id', 'street', 'door_number', 'floor_number', 'city_id'],
      }]
    });

    console.log("post office id:" + postOfficeId)
    console.log("post office:" + postOffice)


    if (!postOffice) {
      return res.status(404).json({ message: 'Agência não encontrada para sua empresa' });
    }

    return res.status(200).json({ address: postOffice.address });

  } catch (error) {
    console.error('Erro ao buscar endereço da agência:', error);
    return res.status(500).json({ message: 'Erro interno' });
  }
};

exports.addAddress = async (req, res) => {
  try {

    const userId = req.user.user_id;

      // Caso o token contenha user_id, buscamos o usuário
      const user = await User.findOne({
        where: { user_id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Criar o novo endereço e associá-lo ao usuário
      const newAddress = await Address.create({
        street: req.body.street,
        door_number: req.body.door_number,
        floor_number: req.body.floor_number,
        city_id: req.body.city_id
      });

      // Associar o novo endereço ao usuário ( a tabela intermediária)
      //melhor forma de associação🤔 
      await user.addAddress(newAddress);

      return res.status(201).json({ message: 'Endereço adicionado com sucesso', address: newAddress });

  } catch (error) {
    console.error('Erro ao adicionar endereço:', error);
    return res.status(500).json({ message: 'Erro interno ao adicionar endereço' });
  }
};

exports.addPostOfficeAddress = async (req, res) => {
  try {

    const postOfficeId = req.params.postOfficeId;
    const postalCompanyId = req.user.postal_company_id;

    // Verificar se o Post Office existe
    const postOffice = await PostOffice.findOne({
      where:{
        post_office_id: postOfficeId,
        postal_company_id: postalCompanyId//para garantir vinculo entre posto e empresa
      }
    });
    if (!postOffice) {
      return res.status(404).json({ message: 'Agência não encontrada para sua empresa' });
    }

    // Criar o novo endereço
    const newAddress = await Address.create({
      street: req.body.street,
      door_number: req.body.door_number,
      floor_number: req.body.floor_number,
      city_id: req.body.city_id
    });

    // Associar o endereço à agência
    await postOffice.setAddress(newAddress); // ou addAddress, dependendo da associação

    return res.status(201).json({ message: 'Endereço adicionado com sucesso à agência', address: newAddress });

  } catch (error) {
    console.error('Erro ao adicionar endereço da agência:', error);
    return res.status(500).json({ message: 'Erro interno ao adicionar endereço' });
  }
};

exports.updateAddress = async (req, res) => {
  try {

    const addressId = req.params.addressId;
    const { street, door_number, floor_number, city_id } = req.body;

    const userId = req.user.user_id;

      // Usuário autenticado
      const user = await User.findOne({
        where: { user_id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Verifica se o endereço pertence ao usuário
      const addresses = await user.getAddresses({
        where: { address_id: addressId }
      });
      //console.log(address)

      if (!addresses || addresses.length === 0) {
        return res.status(404).json({ message: 'Endereço não encontrado para este usuário' });
      }

      console.log(addresses)

      const address = addresses[0];

      await address.update({ street, door_number, floor_number, city_id });

      return res.status(200).json({ message: 'Endereço atualizado com sucesso', address });

  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar endereço' });
  }
};

//lembrete: post office só pode atualizar seu endereço e não apaga-lo💡
exports.updatePostOfficeAddress = async (req, res) => {
  try {
    const postOfficeId = req.params.postOfficeId;
    console.log("post office id:"+postOfficeId)
    const postalCompanyId = req.user.postal_company_id;

    const postOffice = await PostOffice.findOne({
      where:{
        post_office_id: postOfficeId,
        postal_company_id: postalCompanyId//para garantir vinculo entre posto e empresa
      },
      include:[{
        model: Address,
        as: 'address'
      }]
    });

    if (!postOffice) {
      return res.status(404).json({ message: 'Agência não encontrada para sua empresa' });
    }

    // Verificar se o post office já tem endereço associado
    const address = postOffice.address;
    if (!address) {
      return res.status(404).json({ message: 'Nenhum endereço associado à agência' });
    }

    // Atualizar os dados do endereço
    const { street, door_number, floor_number, city_id } = req.body;

    await address.update({ street, door_number, floor_number, city_id });//city_id by dropdown

    return res.status(200).json({ message: 'Endereço atualizado com sucesso', address });

  } catch (error) {
    console.error('Erro ao atualizar endereço da agência:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar endereço' });
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

exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;

      const userId = req.user.user_id;
      console.log(userId)
      const user = await User.findOne({
        where: { user_id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const addresses = await user.getAddresses({
        where: { address_id: addressId }
      });

      if (!addresses || addresses.length === 0) {
        return res.status(404).json({ message: 'Endereço não encontrado para este usuário' });
      }

      const address = addresses[0];

      // Remove a associação e depois deleta o endereço
      await user.removeAddress(address);
      await address.destroy();

      return res.status(200).json({ message: 'Endereço deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar endereço:', error);
    return res.status(500).json({ message: 'Erro interno ao deletar endereço' });
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

//o admin deve ver mais apenas com esta função ou usar as funções especificas?🤔
exports.getPostOfficePrivateProfile = async (req, res) => {

  const { postOfficeId } = req.params;
  const postalCompanyId = req.user.postal_company_id;
    try {
        // Pegar o PostOffice com os dados principais (nome, endereço, email, foto)
        const postOffice = await PostOffice.findOne({
            where: { post_office_id: postOfficeId, postal_company_id: postalCompanyId },
            attributes:{exclude:['created_at','updated_at','deleted_at','is_active']},
            include: [
                {
                    model: File,
                    as: 'photo',
                    attributes: ['file_id', 'url']
                },
            ]
        });

        if (!postOffice) {
            return { error: 'Post Office não encontrado' };
        }

        return res.json({ postOffice});

    } catch (error) {
        console.error('Erro ao buscar Post Office:', error);
        throw new Error('Erro ao buscar Post Office');
    }
};

exports.getPostOfficePublicProfile = async (req, res) => {

  const { postOfficeId } = req.params;
    try {
        // Pegar o PostOffice com os dados principais (nome, endereço, email, foto)
        const postOffice = await PostOffice.findOne({
            where: { post_office_id: postOfficeId },
            attributes:{exclude:['created_at','updated_at','deleted_at','is_active','address_id']},
            include: [
                {
                    model: Address,
                    as: 'address',
                    attributes: ['street', 'city_id', 'door_number', 'floor_number']
                },
                {
                    model: File,
                    as: 'photo',
                    attributes: ['file_id', 'url']
                },
                {
                    model: PhoneNumber,
                    as:'phone_numbers',
                    attributes: ['phone_number'],
                }
            ]
        });

        if (!postOffice) {
            return { error: 'Post Office não encontrado' };
        }

        // Pegar os horários de funcionamento
        const postOfficeHours = await PostOfficeHours.findAll({
            where: { post_office_id: postOfficeId },
            attributes: ['day_of_week', 'opening_time', 'closing_time']
        });

        return res.json({ postOffice , postOfficeHours});

    } catch (error) {
        console.error('Erro ao buscar perfil público do Post Office:', error);
        throw new Error('Erro ao buscar perfil público do Post Office');
    }
};

exports.addPostOfficeHours = async (req, res) => {
  const { postOfficeId } = req.params;
  const {day_of_week, opening_time, closing_time} = req.body;

  const postalCompanyId = req.user.postal_company_id;

  try {
    const postOffice = await PostOffice.findOne({
      where:{
        post_office_id: postOfficeId,
        postal_company_id: postalCompanyId//verifica que administrador so adicione horarios de post offices de sua empresa 
      }
    });
    if (!postOffice) {
      return res.status(403).json({ message: "Agencia não encontrada para sua empresa" });
    }
      const postOfficeHours = await PostOfficeHours.create({
        post_office_id: postOfficeId,
          day_of_week: day_of_week,//dropdown
          opening_time: opening_time,//time selector
          closing_time: closing_time,//time selector
      });

      return res.json({postOfficeHours});
  } catch (error) {
      console.error('Erro ao criar horários do Post Office:', error);
      throw new Error('Erro ao criar horários do Post Office');
  }
};

exports.getPostOfficeHours = async (req, res) => {
  const { postOfficeId } = req.params;
  const postalCompanyId = req.user.postal_company_id;

  try {
      const postOffice = await PostOffice.findOne({
        where:{
          post_office_id: postOfficeId,
          postal_company_id: postalCompanyId
        }
      });

      if (!postOffice) {
        return res.status(404).json({message:"Agencia não encontrada para sua empresa"})
      }
      const postOfficeHours = await PostOfficeHours.findAll({
          where: { post_office_id: postOfficeId },
          attributes: ['day_of_week', 'opening_time', 'closing_time']
      });

      return res.json({postOfficeHours});
  } catch (error) {
      console.error('Erro ao buscar horários do Post Office:', error);
      throw new Error('Erro ao buscar horários do Post Office');
  }
};

//colocar phonembers em resposta?🤔
exports.updatePostOffice = async (req, res) => {
  const { postOfficeId } = req.params;
  const { name, email, phone_numbers } = req.body;
  const postalCompanyId = req.user.postal_company_id;

  try {
    const postOffice = await PostOffice.findOne(
      {
      where:{
        post_office_id: postOfficeId,
        postal_company_id: postalCompanyId
      },
      include: [{ model: Address, as: 'address' }]
    });

    if (!postOffice) {
      return res.status(404).json({ error: 'Agencia não encontrada para sua empresa.' });
    }

    // 1. Atualiza dados do Post Office
    await postOffice.update({ name, email });

    // 3. Atualiza os números de telefone
    if (Array.isArray(phone_numbers)) {
      // Remove antigos
      await PhoneNumber.destroy({
        where: { post_office_id: postOfficeId }
      });

      // Adiciona novos
      const phoneNumberRecords = phone_numbers.map(number => ({
        phone_number: number,
        post_office_id: postOfficeId
      }));

      await PhoneNumber.bulkCreate(phoneNumberRecords);
    }

    res.json({ message: 'Post Office atualizado com sucesso!' });

  } catch (error) {
    console.error('Erro ao atualizar Post Office:', error);
    res.status(500).json({ error: 'Erro ao atualizar Post Office.' });
  }
};

exports.updatePostOfficePhoto = async (req, res) => {
  try {
    //pegar id de postal comp e admin?
    const postOfficeId = req.params.postOfficeId;
    const postalCompanyId = req.user.postal_company_id;

    const postOffice = await PostOffice.findOne({
      where: {
        post_office_id: postOfficeId,
        postal_company_id: postalCompanyId
      },
    });
    if (!postOffice) {
      return res.status(404).json({ message: 'Agencia não encontrada para sua empresa' });
    }

    const uploadedFile = await handleFileUpload(req);

    postOffice.photo_id = uploadedFile.file_id;
    await postOffice.save();

    return res.status(200).json({
      message: 'Foto do posto de correio atualizada com sucesso',
      photo: {
        file_id: uploadedFile.file_id,
        url: uploadedFile.url
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar foto do posto de correio:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar foto do posto de correio' });
  }
};

exports.addPostOffice = async (req, res) => {

  const postalCompanyId = req.user.postal_company_id;
  try {
    const {
      name,
      street,
      city_id,
      door_number,
      floor_number,
      email,
      phone_numbers, // array opcional de números de telefone
    } = req.body;

    if (!name || !city_id || !street) {
      return res.status(400).json({ message: "Campos obrigatórios em falta." });
    }

    const address = await Address.create({
      street,
      city_id,//por drop list
      door_number,
      floor_number,
    });

    // Buscar foto padrão de forma mais segura
    const defaultPhoto = await File.findOne({ where: { tag: DEFAULT_POST_OFFICE_PHOTO } });

    if (!defaultPhoto) {
      console.warn("Foto padrão de posto de correio não encontrada. Usando null.");
    }

    // Criar o posto de correio
    const postOffice = await PostOffice.create({
      name,
      postal_company_id: postalCompanyId,
      address_id: address.address_id,
      email,
      photo_id:defaultPhoto?.file_id || null,
      is_active: true,
    });

    const existingPhones = await PhoneNumber.findAll({
      where: {
        phone_number: phone_numbers,
      }
    });
    
    if (existingPhones.length > 0) {
      return res.status(400).json({
        message: 'Alguns números de telefone já estão em uso.',
        existing: existingPhones.map(p => p.phone_number),
      });
    }
    
    // Criar os números de telefone associados, se fornecidos
    if (Array.isArray(phone_numbers) && phone_numbers.length > 0) {
      const phoneRecords = phone_numbers.map((number) => ({
        phone_number: number,
        post_office_id: postOffice.post_office_id,
        country_id: 1, // selecionar em dropdown
        created_at: new Date(),
        updated_at: new Date(),
      }));
      
      await PhoneNumber.bulkCreate(phoneRecords);
    }

    res.status(201).json({
      message: "Posto de correio criado com sucesso.",
      postOffice,
    });
  } catch (error) {
    console.error("Erro ao criar posto de correio:", error);
    res.status(500).json({ error: "Erro ao criar posto de correio." });
  }
};

//não apaga realmente da BD
exports.deletePostOffice = async (req, res) => {
  //pegar postal company id? admin id?
  
  try {
    const postOfficeId = req.params.postOfficeId;
    console.log("post office id:" + postOfficeId);
    const postalCompanyId = req.user.postal_company_id;

    const postOffice = await PostOffice.findOne({
      where:{
        post_office_id: postOfficeId,
        postal_company_id: postalCompanyId
      }
    });
    if (!postOffice) {
      return res.status(404).json({ message: 'Agencia não encntrada para sua empresa' });
    }

    await postOffice.destroy(); // Soft delete
  
    return res.status(200).json({
      message: 'Posto de correio deletado com sucesso (soft delete)',
      postOfficeId: postOfficeId,
      deleted_at: postOffice.deleted_at,
    });

  } catch (error) {
    console.error('Erro ao deletar posto de correio:', error);
    return res.status(500).json({ message: 'Erro interno ao deletar posto de correio' });
  }
};

//primeiro mostra os dados resumidos na busca pelo nif depois ao clicar no card resumido leva para o perfil do utilizador 
exports.getUserByNIF = async (req, res) => {
  try {
    //pegar user id de quem procura? pra saber quem procurou?
    const { nif } = req.params;

    // Buscar os dados básicos do usuário através da tabela CommonUserData
    const clientUserData = await ClientUserData.findOne({
      where: { nif },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'surname', 'profile_picture_id'],
        }
      ]
    });

    if (!clientUserData || !clientUserData.user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { name, surname, profile_picture_id } = clientUserData.user;

    // Retornar dados básicos para exibir na tela de pesquisa
    res.status(200).json({
      user: {
        name,
        surname,
        profile_picture_id,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuário por NIF' });
  }
};
exports.getUserProfile = async (req, res) => {
  try {
    //pegar user id de que procura? pra saber quem qt vezes viu profile?
    const { nif } = req.params;

    // Buscar dados completos do usuário para exibição do perfil
    const clientUserData = await ClientUserData.findOne({
      where: { nif },
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
