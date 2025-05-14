module.exports = (sequelize, DataTypes) => {
  const OrderStatus = sequelize.define('OrderStatus', {
    order_status_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique:true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  }, {
    tableName: 'order_status',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    paranoid: true,
  });

  OrderStatus.associate=(models)=>{

    OrderStatus.hasMany(models.Order,{foreignKey:'order_status_id',as:'orders'})
  };

  return OrderStatus;
};
