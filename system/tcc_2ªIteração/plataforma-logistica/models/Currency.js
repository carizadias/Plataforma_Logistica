module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define('Currency', {
        currency_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        currency_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true // Garantir que o nome da moeda seja único
        },
        currency_code: {
            type: DataTypes.STRING(3), // ISO 4217 usa códigos de 3 caracteres, por exemplo, 'USD'
            allowNull: false,
            unique: true // O código da moeda deve ser único
        },
        currency_symbol: {
            type: DataTypes.STRING(5), // Símbolo da moeda, como "$", "€", etc.
            allowNull: false
        },
        is_active: {
            type: DataTypes.TINYINT(1),
            defaultValue: 1 // Para indicar se a moeda está ativa
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'createdAt' // Definindo o nome do campo no banco de dados
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updatedAt', // Definindo o nome do campo no banco de dados
            onUpdate: DataTypes.NOW // Atualiza a data automaticamente quando houver alteração
        }
    }, {
        sequelize, // Conexão com o banco de dados
        modelName: 'Currency', // Nome do modelo
        tableName: 'currencies', // Nome da tabela no banco de dados
        timestamps: true, // Garante que os campos createdAt e updatedAt sejam usados
        underscored: true, // Para usar o estilo snake_case (exemplo: created_at, updated_at)
    });
    return Currency;
}
