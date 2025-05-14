const { File, PhoneNumber, Service, PostalCompany, OrderRecipient, PostOffice, Payment, Order, PaymentMethod, PaymentStatus, User, OrderStatus, DeliveryType, OrderType } = require('../../models');
const { handleFileUpload } = require('../../utils/uploadUtils');



//mostrar mais ao cliente?🤔
exports.getPostalCompanyPublicProfile = async (req, res) => {
    try {
        const postalCompanyId = req.params.id;

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
            where: { postal_company_id: postalCompanyId },
            attributes: ['phone_number']
        });

        console.log(phoneNumbers)

        return res.status(200).json({ profile: postalCompany, phone_contacts: phoneNumbers });// phone_contacts: phoneOwners
    } catch (error) {
        console.error('Erro ao obter perfil público da postal company:', error);
        return res.status(500).json({ message: 'Erro interno ao obter perfil' });
    }
};

//mostrar mais ou menos a administrador?🤔
exports.getPostalCompanyPrivateProfile = async (req, res) => {
    try {
        const postalCompanyId = req.params.id;//qual é melhor esta forma ou a que uso em getOrder details

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

exports.getAllPostOfficesByPostalCompanyId = async (req, res) => {
    try {
        const postalCompanyId = req.user.postal_company_id;
        console.log(postalCompanyId)
        const postOffices = await PostOffice.findAll({
            where: { postal_company_id: postalCompanyId }
        });

        return res.json({ postOffices });
    } catch (error) {
        console.error('Erro ao buscar Post Offices:', error);
        throw new Error('Erro ao buscar Post Offices');
    }
};

//colocar phonenumbers em resposta?🤔
//da erro de duplicação se colocar dados anteriores..
exports.updatePostalCompany = async (req, res) => {
    try {
        const { name, email, nif, phone_numbers } = req.body;
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
        console.log('file:' + req.file.fieldname)
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

//Unknown column 'created_at' in 'field list
//verificação de postal company id
exports.getServicesByPostalCompany = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID do posto é obrigatório." });
        }

        const services = await Service.findAll({
            where: { id },
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

exports.getPostalCompanyTransactionHistory = async (req, res) => {
    try {
        const postalCompanyId = req.user.postal_company_id;
        console.log("postalcompanyid:" + postalCompanyId)

        // 1. Buscar todos os PostOffices dessa PostalCompany
        const postOffices = await PostOffice.findAll({
            where: { postal_company_id: postalCompanyId },
            attributes: ['post_office_id'] // Só precisamos do id
        });
        console.log(postOffices);


        // 2. Extrair os IDs dos PostOffices
        const postOfficeIds = postOffices.map(po => po.post_office_id);

        console.log("postOfficeIds" + postOfficeIds)

        if (postOfficeIds.length === 0) {
            return res.status(404).json({ message: "Nenhum PostOffice encontrado para esta PostalCompany." });
        }

        // 3. Buscar todas as transações (Orders) desses PostOffices
        const transactions = await Order.findAll({
            where: { post_office_id: postOfficeIds },
            attributes: ['order_id', 'sender_id'],
            include: [
                {
                    model: Payment,
                    as: "payment",
                    attributes: ['amount'],
                    include: [
                        { model: PaymentMethod, as: "method", attributes: ['name'] },
                        { model: PaymentStatus, as: "status", attributes: ['name'] },
                    ],
                },
            ],
        });
        console.log("transactions" + transactions)

        res.status(200).json({ transactions: transactions });
    } catch (error) {
        console.error("Erro ao obter histórico de transações da PostalCompany:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
