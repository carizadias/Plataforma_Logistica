module.exports = (sequelize, DataTypes) => {
  const Fee = sequelize.define("Fee", {
    fee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subservice_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fee: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    tableName: "fees",
    timestamps: false
  });

  Fee.associate = (models) => {
    Fee.belongsTo(models.OrderType, {
      foreignKey: "order_type_id",
      as: "orderType"
    });

    Fee.belongsTo(models.SubService, {
      foreignKey: "subservice_id",
      as: "subservice"
    });
  };

  return Fee;
};
