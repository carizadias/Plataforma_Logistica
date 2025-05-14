module.exports = (sequelize, DataTypes) => {
    const UserAddress = sequelize.define("UserAddress", {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references:{
                model:'users',
                key:'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        },
        address_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references:{
                model:'addresses',
                key:'address_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        }
    }, {
        tableName: 'user_address',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });
    

    return UserAddress;
};
