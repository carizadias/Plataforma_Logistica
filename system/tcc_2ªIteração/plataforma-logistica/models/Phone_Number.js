module.exports = (sequelize, DataTypes) => {
    const PhoneNumber = sequelize.define('PhoneNumber', {
        phone_number_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        country_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        postal_company_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        post_office_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
    }, {
        tableName: 'phone_numbers',
        timestamps: false,
    });

    PhoneNumber.associate = (models) => {
        PhoneNumber.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });

        PhoneNumber.belongsTo(models.PostalCompany, {
            foreignKey: 'postal_company_id',
            as: 'postal_company',
        });

        PhoneNumber.belongsTo(models.PostOffice, {
            foreignKey: 'post_office_id',
            as: 'post_office',
        });
    };

    return PhoneNumber;
};
