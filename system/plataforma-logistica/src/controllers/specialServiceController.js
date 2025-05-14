const { SubService, SpecialService, SubSpecialService } = require('../../models');

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
//created at e updated at de resposta
exports.getSpecialServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const specialService = await SpecialService.findByPk(id);

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
        const { id } = req.params;
        const { name, description } = req.body;

        const specialService = await SpecialService.findByPk(id);
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
        const { id } = req.params;

        const specialService = await SpecialService.findByPk(id);
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
exports.getSubSpecialServicesBySpecialService = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('special service id:' + id)

        if (!id) {
            return res.status(400).json({ message: "ID do serviço especial é obrigatório." });
        }

        const subSpecialServices = await SubSpecialService.findAll({
            attributes: ['name', 'description'],
            include: [{
                model: SpecialService,
                as: 'specialServices', // alias se definido no relacionamento
                where: { id },
                attributes: [] // não retornar dados da tabela intermediária
            }]
        });

        res.status(200).json(subSpecialServices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar sub-serviços especiais por serviço especial." });
    }
};