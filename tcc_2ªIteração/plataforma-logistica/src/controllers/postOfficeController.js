const { Service, SubService, SpecialService, SubSpecialService, Payment, Order, PaymentMethod, PaymentStatus } = require('../../models');
const db = require("../config/database");

exports.addService = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Nome e descrição são obrigatórios." });
        }

        const newService = await Service.create({
            name,
            description
        });

        res.status(201).json({ message: "Serviço adicionado com sucesso!", service: newService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao adicionar serviço." });
    }
};


exports.addSubService = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Nome e descrição do subserviço é obrigatório." });
        }

        const newSubservice = await SubService.create({
            name,
            description
        });

        res.status(201).json({ message: "Subserviço adicionado com sucesso!", subservice: newSubservice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao adicionar subserviço." });
    }
};

exports.addSpecialService = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Nome do serviço especial é obrigatório." });
        }

        const newSubservice = await SpecialService.create({
            name,
            description
        });

        res.status(201).json({ message: "Serviço especial adicionado com sucesso!", subservice: newSubservice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao adicionar serviço especial." });
    }
};

exports.addSubSpecialService = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Nome do subserviço especial é obrigatório." });
        }

        const newSubservice = await SubSpecialService.create({
            name,
            description
        });

        res.status(201).json({ message: "Subserviço especial adicionado com sucesso!", subservice: newSubservice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao adicionar subserviço especial." });
    }
};

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
        console.log("Dados recebidos:", req.body);

        const { order_type_id, subservice_id, weight_min, weight_max, price_national, price_international } = req.body;

        console.log("Valores extraídos:", order_type_id, subservice_id, weight_min, weight_max, price_national, price_international);

        if (
            order_type_id == null ||
            subservice_id == null ||
            weight_min == null ||
            weight_max == null ||
            price_national == null ||
            price_international == null
        ) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        const [existingFee] = await db.query(
            `SELECT * FROM fees WHERE order_type_id = :order_type_id AND subservice_id = :subservice_id 
            AND :weight_min BETWEEN weight_min AND weight_max 
            LIMIT 1`,
            {
                replacements: { order_type_id, subservice_id, weight_min },
                type: db.QueryTypes.SELECT
            }
        );

        if (existingFee) {
            await db.query(
                `UPDATE fees SET price_national = :price_national, price_international = :price_international 
                WHERE fee_id = :fee_id`,
                {
                    replacements: {
                        price_national,
                        price_international,
                        fee_id: existingFee.fee_id
                    }
                }
            );
            return res.status(200).json({ message: "Tarifa atualizada com sucesso." });
        } else {
            await db.query(
                `INSERT INTO fees (order_type_id, subservice_id, weight_min, weight_max, price_national, price_international)
                VALUES (:order_type_id, :subservice_id, :weight_min, :weight_max, :price_national, :price_international)`,
                {
                    replacements: {
                        order_type_id,
                        subservice_id,
                        weight_min,
                        weight_max,
                        price_national,
                        price_international
                    }
                }
            );
            return res.status(200).json({ message: "Tarifa inserida com sucesso." });
        }
    } catch (error) {
        console.error("Erro ao adicionar ou atualizar tarifa:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
