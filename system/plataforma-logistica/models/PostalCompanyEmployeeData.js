'use strict';

module.exports = (sequelize, DataTypes) => {
    const PostalCompanyEmployeeData = sequelize.define('PostalCompanyEmployeeData', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        postal_company_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'postal_companies',
                key: 'postal_company_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        post_office_id: {
            type: DataTypes.UUID,
            allowNull:true,
            references: {
                model: 'post_offices',
                key: 'post_office_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
    }, {
        tableName: 'postal_company_employee_data',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    PostalCompanyEmployeeData.associate = (models) => {

        PostalCompanyEmployeeData.belongsTo(models.User, {foreignKey: 'user_id',as: 'user'});
        PostalCompanyEmployeeData.belongsTo(models.PostalCompany, {foreignKey: 'postal_company_id',as: 'postalCompany'});
        PostalCompanyEmployeeData.belongsTo(models.PostOffice, {foreignKey: 'post_office_id',as: 'postOffice'});
    };

    return PostalCompanyEmployeeData;
};
