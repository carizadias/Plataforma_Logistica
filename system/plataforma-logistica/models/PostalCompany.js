'use strict';
module.exports = (sequelize, DataTypes) => {
    const PostalCompany = sequelize.define('PostalCompany', {
        postal_company_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        country_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'countries',
                key:'country_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'//não pode apagarpais se tiver ligado a postal company
        },
        logotype_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references:{
                model:'files',
                key:'file_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        name: {//unique?
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        nif: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false//precisa ser validado por system admin tal como seu admin
        },
        is_rejected: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        tableName: 'postal_companies',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
        indexes:[
            {
                fields:['name']
            }
        ]
    });

    PostalCompany.associate = (models) => {

        PostalCompany.belongsTo(models.File, { foreignKey: 'logotype_id', as: 'logotype'});
        PostalCompany.belongsTo(models.Country, { foreignKey: 'country_id', as: 'country'});

        PostalCompany.hasMany(models.PostalCompanyAdminData, { foreignKey: 'postal_company_id',as: 'admins'});
        PostalCompany.hasMany(models.PostalCompanyEmployeeData, { foreignKey: 'postal_company_id',as: 'employees'});
        PostalCompany.hasMany(models.PostOffice, {foreignKey: 'postal_company_id',as: 'post_offices'});
        PostalCompany.hasMany(models.Service, {foreignKey: 'postal_company_id',as: 'services'});
        PostalCompany.hasMany(models.PhoneNumber, {foreignKey: 'postal_company_id',as: 'phoneNumbers'});

    };

    return PostalCompany;
};
