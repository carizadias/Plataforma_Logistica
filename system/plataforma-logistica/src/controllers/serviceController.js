const { PostalCompany,Service, SubService} = require('../../models');


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

//user or postal company admin?access to who?este acima tb mesma pergunta, mas de certeza que é para pcadmin apenas quero saber como o user ve os serviços
//Unknown column 'created_at' in 'field list
//verificação de postal company id
exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

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

//verificação de postal company id
exports.getSubServicesByService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "ID do serviço é obrigatório." });
        }

        const subServices = await SubService.findAll({
            where: { id },
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
