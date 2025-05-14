// models/userType.js
module.exports = (sequelize, DataTypes) => {
    const UserType = sequelize.define('UserType', {
        name: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'user_types',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    UserType.associate = (models) => {
        UserType.hasMany(models.UserRole, {
            foreignKey: 'user_type_name',
            as: 'user_roles',
        });

        // em models/userType.js, dentro de UserType.associate
        // UserType.belongsToMany(models.Permission, {
        //     through: models.UserTypePermission,
        //     foreignKey: 'user_type_name',
        //     otherKey: 'permission_name',
        //     as: 'permissions',
        // });
        UserType.hasMany(models.UserTypePermission, { foreignKey: 'user_type_name', as: 'permissions' });


    };

    return UserType;
};
