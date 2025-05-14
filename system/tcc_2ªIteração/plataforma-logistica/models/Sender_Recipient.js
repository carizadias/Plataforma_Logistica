module.exports = (sequelize, DataTypes) => {
  const SenderRecipient = sequelize.define('sender_recipient', {
    sender_nif: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    recipient_nif: {
      type: DataTypes.CHAR,
      primaryKey: true,

    }
  }, {
    tableName: 'sender_recipient',
    timestamps: false,
  });

  return SenderRecipient;
};
