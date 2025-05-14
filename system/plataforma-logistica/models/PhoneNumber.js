module.exports = (sequelize, DataTypes) => {
    const PhoneNumber = sequelize.define('PhoneNumber', {
        phone_number_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        country_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'countries',
                key: 'country_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        postal_company_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'postal_companies',
                key: 'postal_company_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        post_office_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'post_offices',
                key: 'post_office_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        phone_number: {
            type: DataTypes.STRING(20), // Define um limite de tamanho
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,                     // Garante que não seja string vazia
                len: [8, 20],                       // Garante que o número tenha entre 8 e 20 caracteres
                is: /^\+?[0-9\s\-()]+$/i            // Expressão regular: aceita números, espaços, parênteses, hífens e opcionalmente o "+" no início
            }
        }
    }, {
        tableName: 'phone_numbers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    PhoneNumber.associate = (models) => {

        PhoneNumber.belongsTo(models.Country, {foreignKey: 'country_id',as: 'country',});
        PhoneNumber.belongsTo(models.User, {foreignKey: 'user_id',as: 'user',});
        PhoneNumber.belongsTo(models.PostalCompany, {foreignKey: 'postal_company_id',as: 'postal_company',});
        PhoneNumber.belongsTo(models.PostOffice, {foreignKey: 'post_office_id',as: 'post_office',});
    };

    return PhoneNumber;
};
