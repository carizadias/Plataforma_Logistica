// models/userTypePermission.js
module.exports = (sequelize, DataTypes) => {
    const UserTypePermission = sequelize.define('UserTypePermission', {
        user_type: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'user_types',
                key: 'name'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        permission: {
            type: DataTypes.STRING(100),
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'permissions',
                key: 'name'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    }, {
        tableName: 'user_type_permission',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    return UserTypePermission;
};
