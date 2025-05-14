module.exports = (sequelize, DataTypes) => {
  const OrderType = sequelize.define('OrderType', {
    order_type_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  }, {
    tableName: 'order_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    paranoid: true,
    indexes:[
      {
        fields:['name']//verificar se este indice esta sendo criado
      }
    ]
  });

  OrderType.associate = (models) => {

    OrderType.hasMany(models.Order, { foreignKey: 'order_type_id', as: 'orders' });
    OrderType.hasMany(models.Fee, { foreignKey: 'order_type_id', as: 'fees' });
  };

  return OrderType;
};
