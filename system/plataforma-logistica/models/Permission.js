// models/permission.js
module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
        name: {
            type: DataTypes.STRING(100),
            primaryKey: true,
            unique:true
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        tableName: 'permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true
    });

    Permission.associate = (models) => {

        Permission.belongsToMany(models.Permission,{
            through:'user_type_permission',
            foreignKey:'permission',
            otherKey: 'user_type',
            as:'userTypes'
        });
    };

    return Permission;
};
