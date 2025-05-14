// models/userRole.js
module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        user_type_name: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
    }, {
        tableName: 'user_roles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    UserRole.associate = (models) => {
        UserRole.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });

        UserRole.belongsTo(models.UserType, {
            foreignKey: 'user_type_name',
            as: 'user_type',
        });
    };

    return UserRole;
};
