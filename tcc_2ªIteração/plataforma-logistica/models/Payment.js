module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "payments",
    timestamps: false,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.PaymentMethod, {
      foreignKey: "payment_method_id",
      as: "paymentMethod",
    });

    Payment.belongsTo(models.PaymentStatus, {
      foreignKey: "payment_status_id",
      as: "paymentStatus",
    });

    Payment.hasMany(models.Order, {
      foreignKey: "payment_id",
      as: "orders",
    });

    Payment.associate = function(models) {
      Payment.hasOne(models.Order, { foreignKey: 'payment_id', as: 'order' });
    };
  };

  return Payment;
};
