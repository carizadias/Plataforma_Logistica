module.exports = (sequelize, DataTypes) => {
  const DeliveryType = sequelize.define(
    "DeliveryType",
    {
      delivery_type_id: {
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
      tableName: "delivery_types",
      timestamps: false,
    }
  );

  DeliveryType.associate = (models) => {
    DeliveryType.hasMany(models.Order, {
      foreignKey: "delivery_type_id",
      as: "orders",
    });
  };

  return DeliveryType;
};
