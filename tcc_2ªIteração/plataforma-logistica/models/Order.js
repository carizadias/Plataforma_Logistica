module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sender_nif: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    order_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      allowNull: false
    },
    send_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    post_office_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      allowNull: true
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    current_status: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    order_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    tableName: 'orders',
    timestamps: false
  });




   Order.associate = function(models) {
Order.belongsTo(models.Payment, { foreignKey: 'payment_id', as: 'payment' });


    Order.belongsToMany(models.Recipient, { through: models.OrderRecipient, foreignKey: 'order_id' });
  };

  return Order;
};
