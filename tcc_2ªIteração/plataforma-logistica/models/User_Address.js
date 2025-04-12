// models/UserAddress.js
module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define('UserAddress', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id'
      }
    }
  }, {
    tableName: 'user_addresses',
    timestamps: false  // Desativar timestamps
  });

  UserAddress.associate = function(models) {
    // Define a associação com o modelo User
    UserAddress.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Define a associação com o modelo Address
    UserAddress.belongsTo(models.Address, {
      foreignKey: 'address_id',
      as: 'address'
    });
  };

  return UserAddress;
};
