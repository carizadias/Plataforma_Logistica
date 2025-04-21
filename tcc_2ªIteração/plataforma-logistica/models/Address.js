module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    address_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    door_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    floor_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'city_id',
      },
    },
  }, {
    tableName: 'addresses',
    timestamps: false
  });

  Address.associate = (models) => {
    Address.belongsTo(models.City, {
      foreignKey: 'city_id',
      as: 'city'
    });
  };

  


  return Address;
};
