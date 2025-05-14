// models/fee.js

module.exports = (sequelize, DataTypes) => {
    const Fee = sequelize.define('Fee', {
        fee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sub_service_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        weight_min: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        weight_max: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price_national: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        price_international: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'fees',
        timestamps: false // estamos a controlar manualmente created_at e updated_at
    });

    Fee.associate = (models) => {
        Fee.belongsTo(models.OrderType, {
            foreignKey: 'order_type_id',
            as: 'orderType'
        });

        Fee.belongsTo(models.SubService, {
            foreignKey: 'sub_service_id',
            as: 'subService'
        });
    };

    return Fee;
};
