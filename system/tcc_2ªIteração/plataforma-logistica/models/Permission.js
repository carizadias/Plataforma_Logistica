// models/permission.js
module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
        name: {
            type: DataTypes.STRING(100),
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        tableName: 'permissions',
        timestamps: false,
        underscored: true,
    });

    Permission.associate = (models) => {
        Permission.belongsToMany(models.UserType, {
            through: models.UserTypePermission,
            foreignKey: 'permission_name',
            otherKey: 'user_type_name',
            as: 'roles',
        });
    };

    return Permission;
};
