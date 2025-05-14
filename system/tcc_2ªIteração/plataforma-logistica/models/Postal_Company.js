'use strict';
module.exports = (sequelize, DataTypes) => {
    const PostalCompany = sequelize.define('PostalCompany', {
        postal_company_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nif: {
            type: DataTypes.STRING(20),
            unique: true
        },
        logotype_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        rejected: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        tableName: 'postal_companies',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        paranoid: true
    });

    PostalCompany.associate = function (models) {
        //PostalCompany.belongsTo(models.Country, { foreignKey: 'country_id' });
        PostalCompany.hasMany(models.File, { foreignKey: 'file_id', as: 'logotype' });
        PostalCompany.hasMany(models.PostOffice, {
            foreignKey: 'postal_company_id',
            as: 'post_offices'
        });
        PostalCompany.hasMany(models.Service, {
            foreignKey: 'postal_company_id',
            as: 'services', // nome da associação
        });
    };

    return PostalCompany;
};
