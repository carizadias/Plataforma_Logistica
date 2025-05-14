const { SpecialService, SubSpecialService } = require('../../models');

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
exports.getSubSpecialServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const subSpecialService = await SubSpecialService.findByPk(id, { attributes: ['name', 'description'] });

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
        const postalCompanyId = req.user.id;
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
        const { id } = req.params;

        const subSpecialService = await SubSpecialService.findByPk(id);
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