module.exports = (sequelize, DataTypes) => {
  const PaymentStatus = sequelize.define('PaymentStatus', {
    payment_status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'payment_status',
    timestamps: false
  });

  PaymentStatus.associate = (models) => {
    PaymentStatus.hasMany(models.Payment, {
      foreignKey: 'payment_status_id',
      as: 'payments'
    });
  };

  return PaymentStatus;
};
