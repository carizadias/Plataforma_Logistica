// models/fee.js

module.exports = (sequelize, DataTypes) => {
    const Fee = sequelize.define('Fee', {
        fee_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        order_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'order_types',
                key: 'order_type_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        sub_service_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'sub_services',
                key: 'sub_service_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        weight_min: {
            type: DataTypes.DECIMAL(10, 2), // até 99999999.99
            allowNull: false
        },
        weight_max: {
            type: DataTypes.DECIMAL(10, 2),
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
        }
    }, {
        tableName: 'fees',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    Fee.associate = (models) => {

        Fee.belongsTo(models.OrderType, {foreignKey: 'order_type_id',as: 'orderType'});
        Fee.belongsTo(models.SubService, {foreignKey: 'sub_service_id',as: 'subService'});
    };

    return Fee;
};
