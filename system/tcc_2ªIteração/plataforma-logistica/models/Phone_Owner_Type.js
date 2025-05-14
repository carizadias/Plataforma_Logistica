module.exports = (sequelize, DataTypes) => {
  const PhoneOwnerType = sequelize.define('PhoneOwnerType', {
    phone_owner_type_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    model_class_name: {
        type: DataTypes.STRING, 
        allowNull: false
    }
  }, {
    tableName: 'phone_owner_types',
    timestamps: false
  });

  PhoneOwnerType.associate = (models) => {
    PhoneOwnerType.hasMany(models.PhoneOwner, {
      foreignKey: 'phone_owner_type_id',
      as: 'owners'
    });
  };

  return PhoneOwnerType;
};
