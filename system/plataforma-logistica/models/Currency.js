module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define('Currency', {
        currency_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true // Garantir que o nome da moeda seja único
        },
        code: {
            type: DataTypes.STRING(3), // ISO 4217 usa códigos de 3 caracteres, por exemplo, 'USD'
            allowNull: false,
            unique: true // O código da moeda deve ser único
        },
        symbol: {
            type: DataTypes.STRING(10), // Símbolo da moeda, como "$", "€", etc.
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'currencies',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt:'deleted_at',
        underscored: true,
        paranoid: true,
        indexes:[
            {
                fields:['symbol']
            },
        ]
    });

    Currency.associate=(models)=>{

        Currency.hasMany(models.Payment,{foreignKey:'currency_id',as:'payments'});
        Currency.hasMany(models.Country,{foreignKey:'currency_id',as:'countries'});

    };
    return Currency;
}
