module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
        country_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        country_type_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'country_types',
                key: 'country_type_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        continent_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'continents',
                key: 'continents_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        currency_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'currencies',
                key: 'currency_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        code_alpha2: {
            type: DataTypes.STRING(2), // Ex: 'BR'
            allowNull: false,
            unique: true
        },
        code_alpha3: {
            type: DataTypes.STRING(3), // Ex: 'BRA'
            allowNull: false,
            unique: true
        },
        phone_code: {
            type: DataTypes.STRING(10), // Ex: '+55'
            allowNull: false,
            unique: true
        },
        area: {
            type: DataTypes.DECIMAL(12, 2), // até ~trilhões com 2 casas decimais
            allowNull: true,
        }, 
        timezone: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },                   
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue: true,
        },
    }, {
        tableName: 'countries',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });
    Country.associate = (models) =>{

        Country.hasMany(models.State, {foreignKey:'country_id',as:'states'});
        Country.hasMany(models.PostalCompany, {foreignKey:'country_id',as:'postalCompanies'});
        Country.hasMany(models.PhoneNumber, {foreignKey:'country_id',as:'phoneNumbers'});
        
        Country.belongsTo(models.Currency, {foreignKey:'currency_id',as:'currency'});
        Country.belongsTo(models.Continent, {foreignKey:'continent_id',as:'continent'});
        Country.belongsTo(models.CountryType, {foreignKey:'country_type_id',as:'type'});
    };
    return Country;
};