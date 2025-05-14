'use strict';
module.exports = (sequelize, DataTypes) => {
    const PostOffice = sequelize.define('PostOffice', {
        post_office_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        postal_company_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'postal_companies',
                key:'postal_company_id'
            },
            onUpdate:'CASCADE',
            onDelete:'CASCADE'
        },
        address_id:{
            type: DataTypes.UUID,
            allowNull: true,
            references:{
                model:'addresses',
                key:'address_id'
            },
            onUpdate:'CASCADE',
            onDelete:'SET NULL'
        },
        photo_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'file',
                key: 'file_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'post_offices',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        indexes:[
            {
                fields:['name']
            },
        ]
    });

    PostOffice.associate = (models) => {

        PostOffice.belongsTo(models.PostalCompany, { foreignKey: 'postal_company_id',as:'postalCompany' });
        PostOffice.belongsTo(models.File, {foreignKey: 'photo_id',as: 'photo'});
        PostOffice.belongsTo(models.Address, {foreignKey: 'address_id',as: 'address'});

        PostOffice.hasMany(models.PhoneNumber, {foreignKey: 'post_office_id',as: 'phoneNumbers'});
        PostOffice.hasMany(models.Service, {foreignKey: 'postal_company_id',as: 'services',});
        PostOffice.hasMany(models.Order, {foreignKey: 'post_office_id',as: 'orders',});
        PostOffice.hasMany(models.PostOfficeHours, {foreignKey: 'post_office_id',as: 'hours',});
        
    };

    return PostOffice;
};
