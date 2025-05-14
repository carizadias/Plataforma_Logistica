'use strict';

module.exports = (sequelize, DataTypes) => {
    const PostalCompanyAdminData = sequelize.define('PostalCompanyAdminData', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        postal_company_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'postal_companies',
                key: 'postal_company_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },

    }, {
        tableName: 'postal_company_admin_data',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    PostalCompanyAdminData.associate = (models) => {
        PostalCompanyAdminData.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        PostalCompanyAdminData.belongsTo(models.PostalCompany, {
            foreignKey: 'postal_company_id',
            as: 'postal_company'
        });
    };

    return PostalCompanyAdminData;
};
