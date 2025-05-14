'use strict';
module.exports = (sequelize, DataTypes) => {
    const PostOffice = sequelize.define('PostOffice', {
        post_office_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        postal_company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        photo_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'file',
                key: 'file_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true, // O campo 'deleted_at' pode ser nulo até que um soft delete aconteça
        }
    }, {
        tableName: 'post_offices',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
    });

    PostOffice.associate = function (models) {
        PostOffice.belongsTo(models.PostalCompany, { foreignKey: 'postal_company_id' });
        //PostOffice.belongsTo(models.City, { foreignKey: 'city_id' });
        PostOffice.belongsTo(models.Address, {
            foreignKey: 'address_id',
            as: 'address'
        });

        PostOffice.belongsTo(models.File, {
            foreignKey: 'photo_id',
            as: 'photo'
        });

        PostOffice.hasMany(models.PhoneNumber, {
            foreignKey: 'post_office_id',
            as: 'phone_numbers'
        });
        
        PostOffice.hasMany(models.Service, {//ainda não existe o model Service
            foreignKey: 'postal_company_id',
            as: 'services',
            timestamps: false
        });
        
    };

    return PostOffice;
};
