module.exports = (sequelize, DataTypes) => {
// Exemplo ideal da tabela intermediária
const OrderRecipient = sequelize.define('OrderRecipient', {
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  recipient_id: {
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
  OrderRecipient.belongsTo(models.User, { foreignKey: 'recipient_id', as: 'recipient' });
};


  return OrderRecipient;
};
