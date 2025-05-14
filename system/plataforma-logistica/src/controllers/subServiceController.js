const { Service, SubService, SpecialService } = require('../../models');

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
exports.getSubServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const subService = await SubService.findByPk(id);

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

//verificaçao postalcompany id
//excluir created at e updated at de resposta
exports.getSpecialServicesBySubService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID do sub-serviço é obrigatório." });
        }

        const specialServices = await SpecialService.findAll({
            include: [{
                model: SubService,
                as: 'subServices', // alias se definido no relacionamento
                where: { id },
                attributes: [] // não retornar dados da tabela intermediária
            }]
        });

        res.status(200).json(specialServices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar serviços especiais por subserviço." });
    }
};
