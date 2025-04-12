const { Service, PostOffice, SubService, SpecialService, SubSpecialService, Payment, Order, PaymentMethod, PaymentStatus, User, OrderStatus, DeliveryType, OrderType } = require('../../models');
const feeService = require('../services/feeService');


exports.addService = async (req, res) => {
    try {
        const { name, description, post_office_id } = req.body;

        if (!name || !description || !post_office_id) {
            return res.status(400).json({ message: "Nome e descrição são obrigatórios." });
        }

        const newService = await Service.create({
            name,
            description
        });

        const postOffice = await PostOffice.findByPk(post_office_id);
        if (!postOffice) {
            return res.status(404).json({ message: "Posto de correio não encontrado." });
        }

        await postOffice.addService(newService); // isso cria o vínculo na tabela intermediária

        res.status(201).json({ message: "Serviço adicionado com sucesso!", service: newService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao adicionar serviço." });
    }
};

exports.getServicesByPostOffice = async (req, res) => {
  try {
    const { post_office_id } = req.params;

    if (!post_office_id) {
      return res.status(400).json({ message: "ID do posto é obrigatório." });
    }

    const services = await Service.findAll({
      include: [{
        model: PostOffice,
        as: 'post_offices', // alias se definido no relacionamento
        where: { post_office_id },
        attributes: [] // não retornar dados da tabela intermediária
      }]
    });

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar serviços por posto." });
  }
};

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

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const service = await Service.findByPk(id);
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

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

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



exports.addSubService = async (req, res) => {
    try {
        const { name, description, service_id } = req.body;

        if (!name || !description || !service_id) {
            return res.status(400).json({ message: "Nome e descrição são obrigatórios." });
        }

        const newSubService = await SubService.create({
            name,
            description,
        });

        const service = await Service.findByPk(service_id);
        if (!service) {
            return res.status(404).json({ message: "Serviço não encontrado." });
        }

        await service.addSubService(newSubService); // isso cria o vínculo na tabela intermediária

        res.status(201).json({ message: "Sub Serviço adicionado com sucesso!", service: newSubService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao adicionar sub serviço." });
    }
};

exports.getSubServicesByService = async (req, res) => {
  try {
    const { service_id } = req.params;

    if (!service_id) {
      return res.status(400).json({ message: "ID do serviço é obrigatório." });
    }

    const subServices = await SubService.findAll({
      include: [{
        model: Service,
        as: 'subServices', // alias se definido no relacionamento
        where: { service_id },
        attributes: [] // não retornar dados da tabela intermediária
      }]
    });

    res.status(200).json(subServices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar sub serviços por serviço." });
  }
};

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

exports.updateSubService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const subService = await SubService.findByPk(id);
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

exports.getSpecialServicesBySubService = async (req, res) => {
  try {
    const { sub_service_id } = req.params;

    if (!sub_service_id) {
      return res.status(400).json({ message: "ID do sub-serviço é obrigatório." });
    }

    const specialServices = await SpecialService.findAll({
      include: [{
        model: SubService,
        as: 'specialServices', // alias se definido no relacionamento
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

///


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

exports.getSubSpecialServicesBySpecialService = async (req, res) => {
  try {
    const { special_service_id } = req.params;

    if (!special_service_id) {
      return res.status(400).json({ message: "ID do serviço especial é obrigatório." });
    }

    const subSpecialServices = await SubSpecialService.findAll({
      include: [{
        model: SpecialService,
        as: 'subSpecialServices', // alias se definido no relacionamento
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

exports.getSubSpecialServiceById = async (req, res) => {
  try {
    const { sub_special_service_id } = req.params;
    const subSpecialService = await SubSpecialService.findByPk(sub_special_service_id);

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
    const { sub_special_service_id } = req.params;
    const { name, description } = req.body;

    const subSpecialService = await SubSpecialService.findByPk(sub_special_service_id);
    if (!subSpecialService) {
      return res.status(404).json({ message: "Sub-serviço especial não encontrado." });
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

//restringir resposta para remetente , pagamento(amount), metodo de pagamento, status de pagamento
exports.getTransactionHistory = async (req, res) => {
    try {
        const { postOfficeId } = req.params;


        const transactions = await Order.findAll({
            where: { post_office_id: postOfficeId },
            include: [
                {
                    model: Payment,
                    as: "payment",
                    include: [
                        {
                            model: PaymentMethod,
                            as: "paymentMethod",
                        },
                        {
                            model: PaymentStatus,
                            as: "paymentStatus",
                        },
                    ],
                },
            ],
        });

        res.status(200).json({transactions: transactions});
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


//apenas dados necessarios nas respostas e excluir passes
exports.getOrdersByPostOffice = async (req, res) => {
  try {
    const { post_office_id } = req.params;

    const postOffice = await PostOffice.findByPk(post_office_id);
    if (!postOffice) {
      return res.status(404).json({ message: "Correio não encontrado." });
    }

    const orders = await Order.findAll({
      where: { post_office_id },
      include: [
        { model: User, as: 'sender' },
        { model: User, as: 'recipients' },
        { model: OrderStatus, as: 'status' },
        { model: DeliveryType, as: 'deliveryType' },
        { model: Payment, as: 'payment' },
        { model: OrderType, as: 'orderType' },
        { model: PostOffice, as: 'postOffice' }
      ]
    });

    res.status(200).json({ post_office_id, total_orders: orders.length, orders });
  } catch (error) {
    console.error("Erro ao buscar pedidos do correio:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
