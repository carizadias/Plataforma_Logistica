const { Service, PostOfficeHours, OrderRecipient, PostOffice, SubService, SpecialService, Payment, Order, PaymentMethod, PaymentStatus, User, OrderStatus, DeliveryType, OrderType } = require('../../models');
const feeService = require('../services/feeService');



//verificar postal company id
//escluir created at e updated at de resposta 
exports.addSpecialService = async (req, res) => {
  try {
    const { name, description, sub_service_id } = req.body;

    if (!name || !description || !sub_service_id) {
      return res.status(400).json({ message: "Nome e descrição são obrigatórios." });
    }

    const newSpecialService = await SpecialService.create({
      name,
      description,
    });

    const subService = await SubService.findByPk(sub_service_id);
    if (!subService) {
      return res.status(404).json({ message: "Sub serviço não encontrado." });
    }

    await subService.addSpecialService(newSpecialService); // isso cria o vínculo na tabela intermediária

    res.status(201).json({ message: "Serviço Especial adicionado com sucesso!", service: newSpecialService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar serviço especial." });
  }
};

exports.addPostOfficeAddress = async (req, res) => {
  try {

    const postOfficeId = req.params.id;
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

//lembrete: post office só pode atualizar seu endereço e não apaga-lo💡
exports.updatePostOfficeAddress = async (req, res) => {
  try {
    const postOfficeId = req.params.id;
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

//o admin deve ver mais apenas com esta função ou usar as funções especificas?🤔
exports.getPostOfficePrivateProfile = async (req, res) => {

  const { id } = req.params;
  const postalCompanyId = req.user.postal_company_id;
    try {
        // Pegar o PostOffice com os dados principais (nome, endereço, email, foto)
        const postOffice = await PostOffice.findOne({
            where: { post_office_id: id, postal_company_id: postalCompanyId },
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

  const { id } = req.params;
    try {
        // Pegar o PostOffice com os dados principais (nome, endereço, email, foto)
        const postOffice = await PostOffice.findOne({
            where: { post_office_id: id },
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
            where: { post_office_id: id },
            attributes: ['day_of_week', 'opening_time', 'closing_time']
        });

        return res.json({ postOffice , postOfficeHours});

    } catch (error) {
        console.error('Erro ao buscar perfil público do Post Office:', error);
        throw new Error('Erro ao buscar perfil público do Post Office');
    }
};

exports.getPostOfficeHours = async (req, res) => {
  const { id } = req.params;
  const postalCompanyId = req.user.postal_company_id;

  try {
      const postOffice = await PostOffice.findOne({
        where:{
          post_office_id: id,
          postal_company_id: postalCompanyId
        }
      });

      if (!postOffice) {
        return res.status(404).json({message:"Agencia não encontrada para sua empresa"})
      }
      const postOfficeHours = await PostOfficeHours.findAll({
          where: { post_office_id: id },
          attributes: ['day_of_week', 'opening_time', 'closing_time']
      });

      return res.json({postOfficeHours});
  } catch (error) {
      console.error('Erro ao buscar horários do Post Office:', error);
      throw new Error('Erro ao buscar horários do Post Office');
  }
};

exports.addPostOfficeHours = async (req, res) => {
  const { id } = req.params;
  const {day_of_week, opening_time, closing_time} = req.body;

  const postalCompanyId = req.user.postal_company_id;

  try {
    const postOffice = await PostOffice.findOne({
      where:{
        post_office_id: id,
        postal_company_id: postalCompanyId//verifica que administrador so adicione horarios de post offices de sua empresa 
      }
    });
    if (!postOffice) {
      return res.status(403).json({ message: "Agencia não encontrada para sua empresa" });
    }
      const postOfficeHours = await PostOfficeHours.create({
        post_office_id: id,
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

//colocar phonembers em resposta?🤔
exports.updatePostOffice = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_numbers } = req.body;
  const postalCompanyId = req.user.postal_company_id;

  try {
    const postOffice = await PostOffice.findOne(
      {
      where:{
        post_office_id: id,
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
        where: { post_office_id: id }
      });

      // Adiciona novos
      const phoneNumberRecords = phone_numbers.map(number => ({
        phone_number: number,
        post_office_id: id
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
    const postOfficeId = req.params.id;
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
    const postOfficeId = req.params.id;
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

//verificaçao postalcompany id
//created at e updated at de resposta
exports.getSpecialServiceById = async (req, res) => {
  try {
    const { special_service_id } = req.params;
    const specialService = await SpecialService.findByPk(special_service_id);

    if (!specialService) {
      return res.status(404).json({ message: "Serviço especial não encontrado." });
    }

    res.status(200).json(specialService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar o serviço especial." });
  }
};

//verificaçao postalcompany id
//excluir created at e updated at de resposta
exports.updateSpecialService = async (req, res) => {
  try {
    const { special_service_id } = req.params;
    const { name, description } = req.body;

    const specialService = await SpecialService.findByPk(special_service_id);
    if (!specialService) {
      return res.status(404).json({ message: "Serviço especial não encontrado." });
    }

    specialService.name = name || specialService.name;
    specialService.description = description || specialService.description;
    await specialService.save();

    res.status(200).json({ message: "Serviço especial atualizado com sucesso.", specialService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar o serviço especial." });
  }
};

//problema com delete on cascade
//verificaçao postalcompany id
exports.deleteSpecialService = async (req, res) => {
  try {
    const { special_service_id } = req.params;

    const specialService = await SpecialService.findByPk(special_service_id);
    if (!specialService) {
      return res.status(404).json({ message: "Serviço especial não encontrado." });
    }

    await specialService.destroy();

    res.status(200).json({ message: "Serviço especial removido com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar o serviço especial." });
  }
};

exports.getPostOfficeAddress = async (req, res) => {
  try {

    const postOfficeId = req.params.id;//esta forma permite mudar o nome para utilizar uma variavel clara, parece a melhor forma
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

//cliente tb deveria poder ver seu histórico de pagamentos?🤔
exports.getPostOfficeTransactionHistory = async (req, res) => {
  try {
    const postOfficeId = req.user.postal_company_id;

    const transactions = await Order.findAll({
      where: { post_office_id: postOfficeId },
      attributes:['order_id','sender_id'],
      include: [
        {
          model: Payment,
          as: "payment",
          attributes:['amount'],
          include: [
            {
              model: PaymentMethod,
              as: "method",
              attributes:['name']
            },
            {
              model: PaymentStatus,
              as: "status",
              attributes:['name']
            },
          ],
        },
      ],
    });

    res.status(200).json({ transactions: transactions });
  } catch (error) {
    console.error("Erro ao obter histórico de transações:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

exports.addOrUpdateFee = async (req, res) => {
  try {
    const {
      order_type_id,
      sub_service_id,
      weight_min,
      weight_max,
      price_national,
      price_international
    } = req.body;

    //o fee tem que estar ligado a um serviço um serviço que pertence a um post office que pertence a postal company o admin pode adicionar ou fazer update de um dibservice que não faz parte de sua empresa?
    const adminCompanyId = req.user.postal_company_id;

    const subService = await SubService.findOne({
      where: { sub_service_id },
      attributes: { exclude: ['deleted_at'] },
      include: {
        model: Service,
        as: 'service',
        attributes: ['postal_company_id']
      }
    });

    if (!subService) {
      return res.status(404).json({ message: "Subserviço não encontrado." });
    }

    if (subService.service.postal_company_id !== adminCompanyId) {
      return res.status(403).json({ message: "Não autorizado a modificar este subserviço." });
    }

    // Validação simples
    if (
      [order_type_id, sub_service_id, weight_min, weight_max, price_national, price_international]
        .some(field => field == null)
    ) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }


    const result = await feeService.addOrUpdateFee({
      order_type_id,
      sub_service_id,
      weight_min,
      weight_max,
      price_national,
      price_international
    });

    return res.status(200).json({
      message: result.updated
        ? "Tarifa atualizada com sucesso."
        : "Tarifa inserida com sucesso."
    });

  } catch (error) {
    console.error("Erro ao adicionar ou atualizar tarifa:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

exports.getOrdersByPostOffice = async (req, res) => {
  try {
    const postOfficeId = req.params.id;
    const postalCompanyId = req.user.postal_company_id;

    const postOffice = await PostOffice.findOne({
      where: {
        post_office_id: postOfficeId,
        postal_company_id: postalCompanyId
      }
    });
    if (!postOffice) {
      return res.status(404).json({ message: "Agencia não encontrada para sua empresa." });
    }

    const orders = await Order.findAll({
      where: { post_office_id: postOfficeId },
      include: [
        { model: User, as: 'sender', attributes: ['name', 'surname', 'email'] },
        {
          model: OrderRecipient, as: 'recipients',
          include: [
            { model: User, as: 'recipient', attributes: ['name', 'surname', 'email'] }
          ]
        },
        { model: OrderStatus, as: 'status', attributes: ['name'] },
        { model: DeliveryType, as: 'deliveryType', attributes: ['name'] },
        {
          model: Payment, as: 'payment', attributes: ['amount'],
          include: [
            { model: PaymentMethod, as: 'method', attributes: ['name'] },
            { model: PaymentStatus, as: 'status', attributes: ['name'] }
          ]
        },
        { model: OrderType, as: 'orderType', attributes: ['name'] },
        {
          model: PostOffice, as: 'postOffice', attributes: ['name'],
          // include: [//incluir serviços e outros mais tarde
          //   { model: Service, as: 'services', attributes: [ 'name'],
          //     include: [
          //       { model: SubService, as: 'subServices', attributes: [ 'name'] }
          //     ]...
          //    }
          // ]
        }
      ]
    });

    res.status(200).json({ post_office_id: postOfficeId, total_orders: orders.length, orders });
  } catch (error) {
    console.error("Erro ao buscar pedidos do correio:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
