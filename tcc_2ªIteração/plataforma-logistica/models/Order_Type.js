module.exports = (sequelize, DataTypes) => {
  const OrderType = sequelize.define(
    "OrderType",
    {
      order_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "order_types",
      timestamps: false,
    }
  );

  OrderType.associate = (models) => {
    OrderType.hasMany(models.Order, {
      foreignKey: "order_type_id",
      as: "orders",
    });
  };

  return OrderType;
};
