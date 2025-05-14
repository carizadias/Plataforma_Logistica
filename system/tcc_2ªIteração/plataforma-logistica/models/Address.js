module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
        address_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        door_number: {
            type: DataTypes.CHAR,
            allowNull: true,
        },
        floor_number: {
            type: DataTypes.CHAR,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'addresses',
        timestamps: true,
        createdAt: 'created_at', 
        updatedAt: 'updated_at'     
    });
    Address.associate = (models) => {
        Address.belongsToMany(models.User, {
            through: 'user_address',
            foreignKey: 'address_id',
            otherKey: 'user_id',
            as: 'users',
        });
    }

    return Address;

};
