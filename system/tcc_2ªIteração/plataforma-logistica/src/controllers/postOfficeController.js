const { where } = require('sequelize');
const { Service, PostalCompany, OrderRecipient, PostOffice, SubService, SpecialService, SubSpecialService, Payment, Order, PaymentMethod, PaymentStatus, User, OrderStatus, DeliveryType, OrderType } = require('../../models');
const feeService = require('../services/feeService');

//Unknown column 'created_at' in 'field list'
//verificação de postal company id
exports.addService = async (req, res) => {
  try {
    const { name, description, postal_company_id } = req.body;//mudar logica para postal company has many service, service belongs to postal company 

    if (!name || !description || !postal_company_id) {
      return res.status(400).json({ message: "Nome e descrição são obrigatórios." });
    }

    const postalCompany = await PostalCompany.findByPk(postal_company_id);//service tem que ter postal company id se tem é preciso associatios (belong has many)? sem falar na tabela associativa postal company service
    if (!postalCompany) {
      return res.status(404).json({ message: "Empresa Postal não encontrada." });
    }

    // Criar um novo serviço e associá-lo à empresa postal
    const newService = await Service.create({
      name,
      description,
      postal_company_id // Associando diretamente o serviço à empresa postal
    });

    res.status(201).json({ message: "Serviço adicionado com sucesso!", service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar serviço." });
  }
};

//Unknown column 'created_at' in 'field list
//verificação de postal company id
exports.getServicesByPostalCompany = async (req, res) => {
  try {
    const { postal_company_id } = req.params;

    if (!postal_company_id) {
      return res.status(400).json({ message: "ID do posto é obrigatório." });
    }

    const services = await Service.findAll({
      where: { postal_company_id },
    });

    if (services.length === 0) {
      return res.status(404).json({ message: "Nenhum serviço encontrado para essa empresa postal." });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar serviços por posto." });
  }
};

//user or postal company admin?access to who?este acima tb mesma pergunta, mas de certeza que é para pcadmin apenas quero saber como o user ve os serviços
//Unknown column 'created_at' in 'field list
//verificação de postal company id
exports.getServiceById = async (req, res) => {
  try {
    const { service_id } = req.params;
    const service = await Service.findByPk(service_id);

    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar o serviço." });
  }
};

//verificação de postal company id
//Unknown column 'created_at' in 'field list
exports.updateService = async (req, res) => {
  try {
    const { service_id } = req.params;//id de que? colocar para service_id para ficar padronizado
    const { name, description } = req.body;

    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    await service.save();

    res.status(200).json({ message: "Serviço atualizado com sucesso.", service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar o serviço." });
  }
};

//verificação de postal company id
//Serviço não encontrado
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;//service_id

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Serviço não encontrado." });
    }

    await service.destroy();

    res.status(200).json({ message: "Serviço removido com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar o serviço." });
  }
};

//

//verificação de postal company id
//erro:Unknown column 'created_at' in 'field list
exports.addSubService = async (req, res) => {
  try {
    const { name, description, service_id } = req.body;

    if (!name || !description || !service_id) {
      return res.status(400).json({ message: "Nome e descrição são obrigatórios." });
    }

    const service = await Service.findByPk(service_id);//service tem que ter postal company id se tem é preciso associatios (belong has many)? sem falar na tabela associativa postal company service
    if (!service) {
      return res.status(404).json({ message: "Empresa Postal não encontrada." });
    }

    // Criar um novo serviço e associá-lo à empresa postal
    const newSubService = await SubService.create({
      name,
      description,
      service_id // Associando diretamente o serviço à empresa postal
    });

    res.status(201).json({ message: "Sub Serviço adicionado com sucesso!", sub_service: newSubService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar sub serviço." });
  }
};

//verificação de postal company id
exports.getSubServicesByService = async (req, res) => {
  try {
    const { service_id } = req.params;

    if (!service_id) {
      return res.status(400).json({ message: "ID do serviço é obrigatório." });
    }

    const subServices = await SubService.findAll({
      where: { service_id },
    });

    if (subServices.length === 0) {
      return res.status(404).json({ message: "Nenhum sub serviço encontrado para este serviço." });
    }

    res.status(200).json(subServices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar sub serviços por serviço." });
  }
};

//verificação de postal company id
exports.getSubServiceById = async (req, res) => {
  try {
    const { sub_service_id } = req.params;
    const subService = await SubService.findByPk(sub_service_id);

    if (!subService) {
      return res.status(404).json({ message: "Sub serviço não encontrado." });
    }

    res.status(200).json(subService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar o sub serviço." });
  }
};

//verificação de postal company id 
exports.updateSubService = async (req, res) => {
  try {
    const { sub_service_id } = req.params;
    const { name, description } = req.body;

    const subService = await SubService.findByPk(sub_service_id);
    if (!subService) {
      return res.status(404).json({ message: "Sub serviço não encontrado." });
    }

    subService.name = name || subService.name;
    subService.description = description || subService.description;
    await subService.save();

    res.status(200).json({ message: "Sub serviço atualizado com sucesso.", subService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar o sub serviço." });
  }
};

//não esta encontrando um subservice existente🤔
exports.deleteSubService = async (req, res) => {
  try {
    const { id } = req.params;

    const subService = await SubService.findByPk(id);
    if (!subService) {
      return res.status(404).json({ message: "Sub serviço não encontrado." });
    }

    await subService.destroy();

    res.status(200).json({ message: "Sub serviço removido com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar o sub serviço." });
  }
};

///

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

//verificaçao postalcompany id
//excluir created at e updated at de resposta
exports.getSpecialServicesBySubService = async (req, res) => {
  try {
    const { sub_service_id } = req.params;

    if (!sub_service_id) {
      return res.status(400).json({ message: "ID do sub-serviço é obrigatório." });
    }

    const specialServices = await SpecialService.findAll({
      include: [{
        model: SubService,
        as: 'subServices', // alias se definido no relacionamento
        where: { sub_service_id },
        attributes: [] // não retornar dados da tabela intermediária
      }]
    });

    res.status(200).json(specialServices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar serviços especiais por subserviço." });
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

//falta verificação de req user postal company
exports.addSubSpecialService = async (req, res) => {
  try {
    const { name, description, special_service_id } = req.body;

    if (!name || !description || !special_service_id) {
      return res.status(400).json({ message: "Nome e descrição são obrigatórios." });
    }

    const newSubSpecialService = await SubSpecialService.create({
      name,
      description,
    });

    const specialService = await SpecialService.findByPk(special_service_id);
    if (!special_service_id) {
      return res.status(404).json({ message: "Serviço especial não encontrado." });
    }

    await specialService.addSubSpecialService(newSubSpecialService); // isso cria o vínculo na tabela intermediária

    res.status(201).json({ message: "Sub-serviço Especial adicionado com sucesso!", service: newSubSpecialService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar sub-serviço especial." });
  }
};

//falta verificação de req user postal company
exports.getSubSpecialServicesBySpecialService = async (req, res) => {
  try {
    const { special_service_id } = req.params;
    console.log('special service id:'+special_service_id)

    if (!special_service_id) {
      return res.status(400).json({ message: "ID do serviço especial é obrigatório." });
    }

    const subSpecialServices = await SubSpecialService.findAll({
      attributes:['name','description'],
      include: [{
        model: SpecialService,
        as: 'specialServices', // alias se definido no relacionamento
        where: { special_service_id },
        attributes: [] // não retornar dados da tabela intermediária
      }]
    });

    res.status(200).json(subSpecialServices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar sub-serviços especiais por serviço especial." });
  }
};

//falta verificação de req user postal company
exports.getSubSpecialServiceById = async (req, res) => {
  try {
    const { sub_special_service_id } = req.params;
    const subSpecialService = await SubSpecialService.findByPk(sub_special_service_id, {attributes:['name', 'description']});

    if (!subSpecialService) {
      return res.status(404).json({ message: "Sub serviço especial não encontrado." });
    }

    res.status(200).json(subSpecialService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar o sub-serviço especial." });
  }
};

exports.updateSubSpecialService = async (req, res) => {
  try {
    const postalCompanyId = req.user.postal_company_id;
    console.log(postalCompanyId)
    const { sub_special_service_id } = req.params;
    const { name, description } = req.body;

    //const subSpecialService = await SubSpecialService.findByPk(sub_special_service_id);
    //subspecialservice-specialservice(tabela intermediaria com chave dupla, associação('specialServices'))
    //specialservice-subservice(tabela intermediária com chave dupla, associação('subServices'))
    //subservice-service(fk de service em subservice)
    //service-postalcompany(fk de postal company em service)

    // Buscar o sub_special_service com todas as associações necessárias para validar a empresa
    const subSpecialService = await SubSpecialService.findByPk(sub_special_service_id, {
      include: {
        association: 'specialServices',
        include: {
          association: 'subServices',
          include: {
            association: 'service',
            attributes: ['postal_company_id'],
          },
        },
      },
    });

    if (!subSpecialService) {
      return res.status(404).json({ message: "Sub-serviço especial não encontrado." });
    }

    // Validar se o subSpecialService pertence à postalCompany do admin
    const isFromPostalCompany = subSpecialService.specialServices.some(specialService =>
      specialService.subServices.some(subService =>
        subService.service.postal_company_id === postalCompanyId
      )
    );

    if (!isFromPostalCompany) {
      return res.status(403).json({ message: "Você não tem permissão para atualizar este sub-serviço especial." });
    }

    subSpecialService.name = name || subSpecialService.name;
    subSpecialService.description = description || subSpecialService.description;
    await subSpecialService.save();

    res.status(200).json({ message: "Sub-serviço especial atualizado com sucesso.", subSpecialService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar o sub-serviço especial." });
  }
};

//falta verificação de req user postal company
exports.deleteSubSpecialService = async (req, res) => {
  try {
    const { sub_special_service_id } = req.params;

    const subSpecialService = await SubSpecialService.findByPk(sub_special_service_id);
    if (!subSpecialService) {
      return res.status(404).json({ message: "Serviço especial não encontrado." });
    }

    await subSpecialService.destroy();

    res.status(200).json({ message: "Serviço especial removido com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar o serviço especial." });
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

exports.getPostalCompanyTransactionHistory = async (req, res) => {
  try {
    const postalCompanyId = req.user.postal_company_id;
    console.log("postalcompanyid:"+postalCompanyId)

    // 1. Buscar todos os PostOffices dessa PostalCompany
    const postOffices = await PostOffice.findAll({
      where: { postal_company_id: postalCompanyId },
      attributes: ['post_office_id'] // Só precisamos do id
    });
    console.log(postOffices);
    

    // 2. Extrair os IDs dos PostOffices
    const postOfficeIds = postOffices.map(po => po.post_office_id);

    console.log("postOfficeIds"+postOfficeIds)

    if (postOfficeIds.length === 0) {
      return res.status(404).json({ message: "Nenhum PostOffice encontrado para esta PostalCompany." });
    }

    // 3. Buscar todas as transações (Orders) desses PostOffices
    const transactions = await Order.findAll({
      where: { post_office_id: postOfficeIds },
      attributes:['order_id','sender_id'],
      include: [
        {
          model: Payment,
          as: "payment",
          attributes:['amount'],
          include: [
            { model: PaymentMethod, as: "method" , attributes:['name']},
            { model: PaymentStatus, as: "status", attributes:['name'] },
          ],
        },
      ],
    });
    console.log("transactions"+transactions)

    res.status(200).json({ transactions: transactions });
  } catch (error) {
    console.error("Erro ao obter histórico de transações da PostalCompany:", error);
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
    const postOfficeId = req.params.post_office_id;
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

exports.getOrdersByPostalCompany = async (req, res) => {
  try {
    const postalCompanyId = req.user.postal_company_id;
    console.log(postalCompanyId)

    const postOffices = await PostOffice.findAll({
      where: { postal_company_id: postalCompanyId },
      attributes: ['post_office_id']
    });

    const postOfficeIds = postOffices.map(po => po.post_office_id);

    if (postOfficeIds.length === 0) {
      return res.status(404).json({ message: "Nenhum correio encontrado para esta empresa." });
    }

    const orders = await Order.findAll({
      where: { post_office_id: postOfficeIds },
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
        { model: PostOffice, as: 'postOffice', attributes: ['name'] }
      ]
    });

    res.status(200).json({
      postal_company_id: postalCompanyId,
      total_orders: orders.length,
      orders
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos da empresa postal:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
