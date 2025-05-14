module.exports = (sequelize, DataTypes) => {
  const Recipient = sequelize.define('Recipient', {
    user_nif: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    address_id: {
      type: DataTypes.INTEGER,

    },
    phone_number_id: {
      type: DataTypes.INTEGER,

    },
  }, {
    tableName: 'recipients',
    timestamps: false,
  });

  Recipient.associate = function(models) {
    Recipient.belongsTo(models.Address, { foreignKey: 'address_id' });
    Recipient.belongsTo(models.PhoneNumber, { foreignKey: 'phone_number_id' });

    Recipient.belongsToMany(models.Order, { through: models.OrderRecipient, foreignKey: 'recipient_nif' });

  };

  return Recipient;
};
