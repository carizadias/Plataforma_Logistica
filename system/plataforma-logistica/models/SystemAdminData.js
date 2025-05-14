'use strict';

module.exports = (sequelize, DataTypes) => {
    const SystemAdminData = sequelize.define('SystemAdminData', {
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'user_id'
            },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
        },
    }, {
        tableName: 'system_admin_data',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    SystemAdminData.associate = (models) => {
        
        SystemAdminData.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return SystemAdminData;
};
