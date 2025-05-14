const { User, Address, ClientUserData, Order, OrderRecipient} = require('../../models');


//primeiro mostra os dados resumidos na busca pelo nif depois ao clicar no card resumido leva para o perfil do utilizador 
exports.getUserByNIF = async (req, res) => {
    try {
        //pegar user id de quem procura? pra saber quem procurou?
        const { nif } = req.params;

        // Buscar os dados básicos do usuário através da tabela CommonUserData
        const clientUserData = await ClientUserData.findOne({
            where: { nif },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'surname', 'profile_picture_id'],
                }
            ]
        });

        if (!clientUserData || !clientUserData.user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const { name, surname, profile_picture_id } = clientUserData.user;

        // Retornar dados básicos para exibir na tela de pesquisa
        res.status(200).json({
            user: {
                name,
                surname,
                profile_picture_id,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuário por NIF' });
    }
};

exports.getAddresses = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const user = await User.findOne({
            where: { user_id: userId },
            include: [{
                model: Address,
                as: 'addresses',
                attributes: ['address_id', 'street', 'door_number', 'floor_number', 'city_id'],
                through: { attributes: [] }
            }]
        });

        //console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        return res.status(200).json({ addresses: user.addresses });

    } catch (error) {
        console.error('Erro ao obter endereços:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar endereços' });
    }
};

exports.addAddress = async (req, res) => {
    try {

        const userId = req.user.user_id;

        // Caso o token contenha user_id, buscamos o usuário
        const user = await User.findOne({
            where: { user_id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Criar o novo endereço e associá-lo ao usuário
        const newAddress = await Address.create({
            street: req.body.street,
            door_number: req.body.door_number,
            floor_number: req.body.floor_number,
            city_id: req.body.city_id
        });

        // Associar o novo endereço ao usuário ( a tabela intermediária)
        //melhor forma de associação🤔 
        await user.addAddress(newAddress);

        return res.status(201).json({ message: 'Endereço adicionado com sucesso', address: newAddress });

    } catch (error) {
        console.error('Erro ao adicionar endereço:', error);
        return res.status(500).json({ message: 'Erro interno ao adicionar endereço' });
    }
};

exports.updateAddress = async (req, res) => {
    try {

        const addressId = req.params.id;
        const { street, door_number, floor_number, city_id } = req.body;

        const userId = req.user.user_id;

        // Usuário autenticado
        const user = await User.findOne({
            where: { user_id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se o endereço pertence ao usuário
        const addresses = await user.getAddresses({
            where: { address_id: addressId }
        });
        //console.log(address)

        if (!addresses || addresses.length === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado para este usuário' });
        }

        console.log(addresses)

        const address = addresses[0];

        await address.update({ street, door_number, floor_number, city_id });

        return res.status(200).json({ message: 'Endereço atualizado com sucesso', address });

    } catch (error) {
        console.error('Erro ao atualizar endereço:', error);
        return res.status(500).json({ message: 'Erro interno ao atualizar endereço' });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;

        const userId = req.user.user_id;
        console.log(userId)
        const user = await User.findOne({
            where: { user_id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const addresses = await user.getAddresses({
            where: { address_id: addressId }
        });

        if (!addresses || addresses.length === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado para este usuário' });
        }

        const address = addresses[0];

        // Remove a associação e depois deleta o endereço
        await user.removeAddress(address);
        await address.destroy();

        return res.status(200).json({ message: 'Endereço deletado com sucesso' });

    } catch (error) {
        console.error('Erro ao deletar endereço:', error);
        return res.status(500).json({ message: 'Erro interno ao deletar endereço' });
    }
};

exports.getRecipientsByUser = async (req, res) => {
    const userId = req.user.user_id;

    try {
        // Buscar todas as ordens enviadas por esse usuário
        // Buscar encomendas enviadas por esse user
        const orders = await Order.findAll({
            where: { sender_id: userId },
            include: {
                model: OrderRecipient,
                as: 'recipients',
                include: {
                    model: User,
                    as: 'recipient',
                    attributes: ['user_id', 'name', 'email']
                }
            }
        });

        // Verificar se existem ordens ou destinatários encontrados
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Nenhum destinatário encontrado.' });
        }

        // Extrair os Users dos destinatários e evitar duplicados
        const recipients = [];
        const seenUserIds = new Set();

        orders.forEach(order => {
            order.recipients.forEach(orderRecipient => {
                const recipient = orderRecipient.recipient;
                if (recipient && !seenUserIds.has(recipient.user_id)) {
                    recipients.push(recipient);
                    seenUserIds.add(recipient.user_id);
                }
            });
        });

        // Retornar todos os destinatários encontrados
        return res.status(200).json({ recipients });
    } catch (error) {
        console.error("Erro ao buscar destinatários:", error);
        return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
};
