module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        order_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        order_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        height: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        width: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        weight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        payment_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        send_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        post_office_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        order_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tracking_code: {
            type: DataTypes.CHAR(12),
            allowNull: false,
            unique: true,
        },
        delivery_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        delivery_date: {
            type: DataTypes.DATEONLY,
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
        tableName: 'orders',
        timestamps: false, // se estiveres a usar os campos manualmente
        underscored: true,
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
        Order.belongsTo(models.OrderType, { foreignKey: 'order_type_id', as: 'orderType' });
        Order.belongsTo(models.Payment, { foreignKey: 'payment_id', as:'payment' });
        Order.belongsTo(models.PostOffice, { foreignKey: 'post_office_id', as:'postOffice' });
        Order.belongsTo(models.OrderStatus, { foreignKey: 'order_status_id', as: 'status' });
        Order.belongsTo(models.DeliveryType, { foreignKey: 'delivery_type_id', as: 'deliveryType' });
        

        Order.hasMany(models.OrderRecipient, { foreignKey: 'order_id', as: 'recipients' });
    };

    return Order;
};
