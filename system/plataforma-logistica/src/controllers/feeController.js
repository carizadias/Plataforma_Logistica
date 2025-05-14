require('dotenv').config();
const { Service, SubService} = require('../../models');
const feeService = require('../services/feeService');


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

exports.calculateFee = async (req, res) => {
    try {
        const { sub_service_id, order_type_id, destination, weight } = req.query;

        if (!sub_service_id || !order_type_id || !destination || isNaN(weight)) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios e o peso deve ser numérico." });
        }

        console.log("req.query" + req.query)

        const price = await feeService.calculateFee({
            sub_service_id,
            order_type_id,
            weight: parseFloat(weight),
            destination
        });

        console.log("price:" + price)

        return res.status(200).json({ price });

    } catch (error) {
        console.error("Erro ao calcular preço:", error.message);
        return res.status(404).json({ message: error.message });
    }
};