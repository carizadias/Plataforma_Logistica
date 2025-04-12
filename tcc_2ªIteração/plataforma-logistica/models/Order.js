module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },    
    order_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_types',
        key: 'order_type_id'
      }
    },
    height: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    width: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payments',
        key: 'payment_id'
      }
    },
    send_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    post_office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post_offices',
        key: 'post_office_id'
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tracking_code: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    delivery_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'delivery_types',
        key: 'delivery_type_id'
      }
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    order_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,// pending
      references: {
        model: 'order_status',
        key: 'order_status_id'
      }
    }
  }, {
    tableName: 'orders',
    timestamps: false
  });

  Order.associate = function(models) {
    Order.belongsTo(models.Payment, { foreignKey: 'payment_id', as: 'payment' });
    Order.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    Order.belongsTo(models.OrderType, { foreignKey: 'order_type_id', as: 'orderType' });
    Order.belongsTo(models.PostOffice, { foreignKey: 'post_office_id', as: 'postOffice' });
    Order.belongsTo(models.DeliveryType, { foreignKey: 'delivery_type_id', as: 'deliveryType' });
    Order.belongsTo(models.OrderStatus, { foreignKey: 'order_status_id', as: 'status' });

    Order.belongsToMany(models.User, {
      through: models.OrderRecipient,
      foreignKey: 'order_id',
      otherKey: 'recipient_id',
      as: 'recipients'
    });
  };

  return Order;
};
