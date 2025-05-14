module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        order_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'//não pode apagar utilizar com pedido
        },
        order_type_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'order_types',
                key: 'order_type_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        payment_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'payments',
                key: 'payment_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        post_office_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'post_offices',
                key: 'post_office_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        order_status_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'order_status',
                key: 'order_status_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        delivery_type_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'delivery_types',
                key: 'delivery_type_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
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
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        tracking_code: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        send_date: {
            type: DataTypes.DATE,//daqui tiro a hora de envio tb
            allowNull: false,
        },
        delivery_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
    });

    Order.associate = (models) => {

        Order.hasOne(models.OrderEvaluation, { foreignKey: 'order_id', as: 'evaluation' });

        Order.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
        Order.belongsTo(models.OrderType, { foreignKey: 'order_type_id', as: 'orderType' });
        Order.belongsTo(models.Payment, { foreignKey: 'payment_id', as: 'payment' });
        Order.belongsTo(models.PostOffice, { foreignKey: 'post_office_id', as: 'postOffice' });
        Order.belongsTo(models.OrderStatus, { foreignKey: 'order_status_id', as: 'status' });
        Order.belongsTo(models.DeliveryType, { foreignKey: 'delivery_type_id', as: 'deliveryType' });
        

        Order.belongsToMany(models.User,{
            through:'order_recipient',
            foreignKey:'order_id',
            otherKey: 'recipient_id',
            as:'recipients'
        });
    };

    return Order;
};
