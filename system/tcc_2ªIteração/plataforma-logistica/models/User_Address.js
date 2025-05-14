module.exports = (sequelize, DataTypes) => {
    const UserAddress = sequelize.define("UserAddress", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        address_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'user_address',
        timestamps: false,
    });

    return UserAddress;
};
