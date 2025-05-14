module.exports = (sequelize, DataTypes) => {
  const OrderType = sequelize.define('OrderType', {
    order_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'order_types',
    timestamps: false
  });

  OrderType.associate = (models) => {
    // OrderType has many Orders (um para muitos)
    OrderType.hasMany(models.Fee, { foreignKey: 'order_type_id', as: 'fees' });
  };

  return OrderType;
};
