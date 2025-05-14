// models/userRole.js
module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references:{
                model:'users',
                key:'user_id'
            },
                onUpdate:'CASCADE',
                onDelete: 'CASCADE',

        },
        user_type: {//nome pra deixar claro que é string?
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            references:{
                model:'user_types',
                key:'name'
            },
                onUpdate:'CASCADE',
                onDelete: 'CASCADE',
        },
    }, {
        tableName: 'user_role',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    return UserRole;
};
