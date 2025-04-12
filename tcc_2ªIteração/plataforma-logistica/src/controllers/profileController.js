const bcrypt = require('bcryptjs');
const { User, Address, Agency, PhoneNumber, ProfilePicture, UserAddress, PostOfficeUser, PostOfficeUserType, PostOffice, UserType, UserRole, CommonUserData, AdminUserData, PostOfficeAdminData, PostOfficeEmployeeData } = require('../../models');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { type } = require('os');
const getUserModelByType = require('../../utils/getUserModelByType')
const postOfficeService = require('../services/postOfficeService');

//colocar este multer em serviço
const multer = require('multer');
//const path = require('path');

// Configuração do multer para o upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Diretório para armazenar as imagens
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para cada imagem
  }
});

const upload = multer({ storage: storage }).single('profile_picture');

exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Espera-se o token no cabeçalho da requisição
    if (!token) return res.status(403).json({ message: 'Token não fornecido' });

    // 1. Verificar o token JWT e extrair o user_id
    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const user_id = decoded.user_id;

    // 2. Encontrar o utilizador pelo user_id
    const user = await User.findOne({
      where: { user_id },
      include: [
        {
          model: UserRole,
          as: 'roles',
          include: [{ model: UserType, as: 'type' }]
        }
      ]
    });

    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });

    // 3. Verificar o tipo de utilizador e buscar dados específicos
    const roles = user.roles.map(r => r.user_type);
    const userType = roles.length > 0 ? roles[0] : 'unknown'; // Pega o primeiro tipo de papel(é a melhor logica?)


    // 4. Retornar o perfil completo
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

exports.getCommonProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token não fornecido' });

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const user_id = decoded.user_id;

    const additionalData = await CommonUserData.findOne({ where: { user_id } });
    if (!additionalData) return res.status(404).json({ message: 'Dados adicionais não encontrados' });

    return res.status(200).json({ additional_data: additionalData });

  } catch (error) {
    console.error('Erro ao buscar dados adicionais:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token não fornecido' });

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const user_id = decoded.user_id;

    const additionalData = await AdminUserData.findOne({ where: { user_id } });
    if (!additionalData) return res.status(404).json({ message: 'Dados adicionais não encontrados' });

    return res.status(200).json({ additional_data: additionalData });

  } catch (error) {
    console.error('Erro ao buscar dados adicionais:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};

exports.getPostOfficeAdminProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token não fornecido' });

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const user_id = decoded.user_id;

    const additionalData = await PostOfficeAdminData.findOne({ where: { user_id } });
    if (!additionalData) return res.status(404).json({ message: 'Dados adicionais não encontrados' });

    return res.status(200).json({ additional_data: additionalData });

  } catch (error) {
    console.error('Erro ao buscar dados adicionais:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};

exports.getPostOfficeEmployeeProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token não fornecido' });

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const user_id = decoded.user_id;

    const additionalData = await PostOfficeEmployeeData.findOne({ where: { user_id } });
    if (!additionalData) return res.status(404).json({ message: 'Dados adicionais não encontrados' });

    return res.status(200).json({ additional_data: additionalData });

  } catch (error) {
    console.error('Erro ao buscar dados adicionais:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
};


exports.updateProfile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Assumindo que o token é passado no header "Authorization" como "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Decodificar o token para obter o user_id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;

    console.log(decoded);
    console.log("userId:" + decoded.user_id);
    console.log("userRole:" + decoded.role);

    // Encontrar o usuário
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Processar o upload da imagem
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no upload da imagem', error: err });
      }

      if (req.file) {
        console.log("profile_picture:", req.file);

        // Salvar a imagem na tabela 'profile_pictures'
        const profilePicture = await ProfilePicture.create({
          image_url: req.file.path, // O caminho completo da imagem
        });

        // Atualizar o campo profile_picture_id do usuário com o ID da imagem
        user.profile_picture_id = profilePicture.profile_picture_id;
        await user.save();

        console.log('Imagem salva na tabela profile_pictures', profilePicture);
      }
    // Encontrar os dados específicos do usuário com base no seu tipo de usuário
    const userType = await UserRole.findOne({
      where: { user_id: userId },
      include: [{ model: UserType, as: 'type' }],
    });

    console.log("userType:"+userType)

    
    if (!userType || !userType.type) {
        return res.status(400).json({ message: 'Tipo de usuário não encontrado' });
    }

    const type = userType.type.name;

    // Obter o modelo específico com base no tipo
    const SpecificModel = getUserModelByType(type);
    if (!SpecificModel) {
        return res.status(400).json({ message: 'Tipo de usuário inválido' });
    }
    console.log("specificModel:" + SpecificModel)

    // Atualizar os dados do usuário
    const { name, surname, email, password, profile_picture_id, userData } = req.body;

      // Atualizar os dados comuns do usuário
      //const { name, surname, email, password } = req.body;
      user.name = name || user.name;
      user.surname = surname || user.surname;
      user.email = email || user.email;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      user.profile_picture_id = profile_picture_id || user.profile_picture_id;

     // Atualizar os dados específicos do usuário
    await SpecificModel.update(userData, { where: { user_id: userId } });


      await user.save();

      return res.status(200).json({ message: 'Perfil atualizado com sucesso' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};



exports.getAddresses = async (req, res) => {
  try {
    // Extrair o token do header "Authorization" (formato: "Bearer <token>")
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Decodificar o token usando a chave secreta configurada
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);

    // Verificar se o token contém um user_id (para usuários) ou post_office_id (para agências)
    if (decoded.post_office_id) {
      // Caso o token contenha post_office_id, buscamos as agências com seus endereços
      const agencies = await Agency.findAll({
        where: { post_office_id: decoded.post_office_id },
        include: [{
          // Supondo que o modelo Agency tenha uma associação para os endereços
          model: Address,
          as: 'addresses',
          attributes: ['address_id', 'street', 'door_number', 'floor_number', 'city_id'],
          through : { attributes: [] }
        }]
      });

      //console.log(agencies);

      if (!agencies || agencies.length === 0) {
        return res.status(404).json({ message: 'Nenhuma agência encontrada para este correio' });
      }
      
      return res.status(200).json({ agencies });
      // const allAddresses = agencies.flatMap(agency => agency.addresses);
      // return res.status(200).json({ addresses: allAddresses });
      
    } else if (decoded.user_id) {
      // Caso seja um usuário comum, buscamos o usuário com seus endereços
      const user = await User.findOne({
        where: { user_id: decoded.user_id },
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
      
    } else {
      return res.status(400).json({ message: 'Token inválido. Nenhum identificador encontrado.' });
    }

  } catch (error) {
    console.error('Erro ao obter endereços:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar endereços' });
  }
};


exports.addAddress = async (req, res) => {
  try {
    // Extrair o token do header "Authorization" (formato: "Bearer <token>")
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Decodificar o token usando a chave secreta configurada
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);

    // Verificar se o token contém um user_id (para usuários) ou post_office_id (para agências)
    if (decoded.post_office_id) {
      // Caso o token contenha post_office_id, buscamos a agência
      const agency = await Agency.findOne({
        where: { 
          agency_id: req.body.agency_id,
          post_office_id: decoded.post_office_id 
        }
      });

      if (!agency) {
        return res.status(404).json({ message: 'Agência não encontrada' });
      }

      // Criar o novo endereço e associá-lo à agência
      const newAddress = await Address.create({
        street: req.body.street,
        door_number: req.body.door_number,
        floor_number: req.body.floor_number,
        city_id: req.body.city_id
      });

      // Associar o novo endereço à agência (supondo a tabela intermediária)
      await agency.addAddress(newAddress);

      return res.status(201).json({ message: 'Endereço adicionado com sucesso', address: newAddress });

    } else if (decoded.user_id) {
      // Caso o token contenha user_id, buscamos o usuário
      const user = await User.findOne({
        where: { user_id: decoded.user_id }
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
      await user.addAddress(newAddress);

      return res.status(201).json({ message: 'Endereço adicionado com sucesso', address: newAddress });

    } else {
      return res.status(400).json({ message: 'Token inválido. Nenhum identificador encontrado.' });
    }

  } catch (error) {
    console.error('Erro ao adicionar endereço:', error);
    return res.status(500).json({ message: 'Erro interno ao adicionar endereço' });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    // Extrair o token do header "Authorization" (formato: "Bearer <token>")
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: addressId } = req.params;
    const { street, door_number, floor_number, city_id } = req.body;

    if (decoded.post_office_id) {
      // Correio autenticado
      const agency = await Agency.findOne({
        where: {
          agency_id: req.body.agency_id,
          post_office_id: decoded.post_office_id
        }
      });
      console.log(decoded)
      console.log(agency)

      if (!agency) {
        return res.status(404).json({ message: 'Agência não encontrada ou não pertence ao correio autenticado' });
      }

      // Verifica se o endereço está realmente associado à agência
      const addresses = await agency.getAddresses({
        where: { address_id: addressId }
      });

      if (!addresses || addresses.length === 0) {
        return res.status(404).json({ message: 'Endereço não encontrado para esta agência' });
      }

      const address = addresses[0];

      await address.update({ street, door_number, floor_number, city_id });

      return res.status(200).json({ message: 'Endereço atualizado com sucesso', address });

    } else if (decoded.user_id) {
      // Usuário autenticado
      const user = await User.findOne({
        where: { user_id: decoded.user_id }
      });
      console.log(decoded)

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Verifica se o endereço pertence ao usuário
      const addresses = await user.getAddresses({
        where: { address_id: addressId }
      });
      console.log(address)

      if (!addresses || addresses.length === 0) {
        return res.status(404).json({ message: 'Endereço não encontrado para este usuário' });
      }

      console.log(addresses)

      const address = addresses[0];

      await address.update({ street, door_number, floor_number, city_id });

      return res.status(200).json({ message: 'Endereço atualizado com sucesso', address });

    } else {
      return res.status(400).json({ message: 'Token inválido. Nenhum identificador encontrado.' });
    }

  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    return res.status(500).json({ message: 'Erro interno ao atualizar endereço' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    // Extrair o token do header "Authorization"
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: addressId } = req.params;

    if (decoded.post_office_id) {
      // Correio autenticado
      const agency = await Agency.findOne({
        where: {
          agency_id: req.body.agency_id,
          post_office_id: decoded.post_office_id
        }
      });

      if (!agency) {
        return res.status(404).json({ message: 'Agência não encontrada ou não pertence ao correio autenticado' });
      }

      const addresses = await agency.getAddresses({
        where: { address_id: addressId }
      });

      if (!addresses || addresses.length === 0) {
        return res.status(404).json({ message: 'Endereço não encontrado para esta agência' });
      }

      const address = addresses[0];

      // Remove a associação e depois deleta o endereço
      await agency.removeAddress(address);
      await address.destroy();

      return res.status(200).json({ message: 'Endereço deletado com sucesso' });

    } else if (decoded.user_id) {
      // Usuário autenticado
      const user = await User.findOne({
        where: { user_id: decoded.user_id }
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

    } else {
      return res.status(400).json({ message: 'Token inválido. Nenhum identificador encontrado.' });
    }

  } catch (error) {
    console.error('Erro ao deletar endereço:', error);
    return res.status(500).json({ message: 'Erro interno ao deletar endereço' });
  }
};


exports.getPostOfficeProfile = async (req, res) => {
  try {
    const postOfficeId = req.params.id;

    const profile = await postOfficeService.getPostOfficeProfile(postOfficeId);

    if (!profile) {
      return res.status(404).json({ message: 'Correio não encontrado' });
    }

    return res.status(200).json(profile);

  } catch (error) {
    console.error('Erro ao buscar perfil do correio:', error);
    return res.status(500).json({ message: 'Erro interno ao obter perfil do correio' });
  }
};

//em desuso por agr
// exports.updateProfilePicture = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         if (!req.file) {
//             return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
//         }

//         const user = await User.findByPk(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'Usuário não encontrado.' });
//         }

//         if (user.profile_picture) {
//             const oldImagePath = path.join(__dirname, '..', 'uploads/profile_pictures', user.profile_picture);
//             if (fs.existsSync(oldImagePath)) {
//                 fs.unlinkSync(oldImagePath);
//             }
//         }

//         user.profile_picture = req.file.filename;
//         await user.save();

//         res.status(200).json({ message: 'Imagem de perfil atualizada com sucesso!', profile_picture: user.profile_picture });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Erro ao atualizar a imagem de perfil.' });
//     }
// };

exports.getUserByNIF = async (req, res) => {
  try {
    const { nif } = req.params;

    // Buscar os dados básicos do usuário através da tabela CommonUserData
    const commonUserData = await CommonUserData.findOne({
      where: { nif },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'surname', 'profile_picture_id'],
        }
      ]
    });

    if (!commonUserData || !commonUserData.user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { name, surname, profile_picture_id } = commonUserData.user;

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
    const { nif } = req.params;

    // Buscar dados completos do usuário para exibição do perfil
    const commonUserData = await CommonUserData.findOne({
      where: { nif },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'surname', 'email', 'profile_picture_id'],
        },
        {
          model: Address,
          as: 'address',  // Exibindo o endereço completo
          attributes: ['street', 'floor_number','door_number', 'city_id']
        },
        {
          model: PhoneNumber,
          as: 'phone_number',  // Exibindo o telefone completo
          attributes: ['phone_number','phone_number_code']
        }
      ]
    });

    if (!commonUserData || !commonUserData.user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const { name, surname, email, profile_picture_id } = commonUserData.user;
    const address = commonUserData.address;
    const phoneNumber = commonUserData.phone_number;

    // Retornar todos os dados para exibir o perfil completo
    res.status(200).json({
      user: {
        name,
        surname,
        email,
        profile_picture_id,
        address,
        phoneNumber
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
  }
};
