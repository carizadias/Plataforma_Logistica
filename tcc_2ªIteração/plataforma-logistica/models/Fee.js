// models/Fee.js
module.exports = (sequelize, DataTypes) => {
  const Fee = sequelize.define("Fee", {
    fee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_types',
        key: 'order_type_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    sub_service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sub_services',
        key: 'sub_service_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    weight_min: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    weight_max: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    price_national: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    price_international: {
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
      foreignKey: "sub_service_id",
      as: "subService"
    });
  };

  return Fee;
};
