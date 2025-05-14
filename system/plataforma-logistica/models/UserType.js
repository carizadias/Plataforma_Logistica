// models/userType.js
module.exports = (sequelize, DataTypes) => {
    const UserType = sequelize.define('UserType', {
        name: {//melhor usar id: uuid?
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            unique: true
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
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
        indexes:[
            {
                unique:true,
                fields:['name'],
            }
        ]
    });

    UserType.associate = (models) => {

        UserType.belongsToMany(models.Permission,{
            through:'user_type_permission',
            foreignKey:'user_type',
            otherKey: 'permission',
            as:'permissions'
        });

        UserType.belongsToMany(models.User,{
            through:'user_role',
            foreignKey:'user_type',
            otherKey: 'user_id',
            as:'roles'
        });
    };

    return UserType;
};
