// models/userTypePermission.js
module.exports = (sequelize, DataTypes) => {
    const UserTypePermission = sequelize.define('UserTypePermission', {
        user_type_name: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        permission_name: {
            type: DataTypes.STRING(100),
            primaryKey: true,
            allowNull: false,
        },
    }, {
        tableName: 'user_type_permissions',
        timestamps: false,
        underscored: true,
    });

    UserTypePermission.associate = (models) => {
        UserTypePermission.belongsTo(models.UserType, {
            foreignKey: 'user_type_name',
            as: 'role',
        });

        UserTypePermission.belongsTo(models.Permission, {
            foreignKey: 'permission_name',
            as: 'permission',
        });
    };

    return UserTypePermission;
};
