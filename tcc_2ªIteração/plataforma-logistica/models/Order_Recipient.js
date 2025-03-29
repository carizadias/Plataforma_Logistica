module.exports = (sequelize, DataTypes) => {
  const OrderRecipient = sequelize.define('OrderRecipient', {
    recipient_nif: {
      type: DataTypes.CHAR,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'order_recipient',
    timestamps: false,
  });

  OrderRecipient.associate = (models) => {
      OrderRecipient.belongsTo(models.Order, { foreignKey: 'order_id' });
      OrderRecipient.belongsTo(models.Recipient, { foreignKey: 'recipient_nif' });


  };

  return OrderRecipient;
};
