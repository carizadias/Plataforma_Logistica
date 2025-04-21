module.exports = (sequelize, DataTypes) => {
  const PhoneOwner = sequelize.define('PhoneOwner', {
    phone_owner_id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    phone_number_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'phone_numbers', 
        key: 'phone_number_id'
      }
    },
    owner_id: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    owner_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'phone_owner_types', 
        key: 'id'
      }
    }
  }, {
    tableName: 'phone_owners',
    timestamps: false
  });

  PhoneOwner.associate = (models) => {
    PhoneOwner.belongsTo(models.PhoneNumber, {
      foreignKey: 'phone_number_id',
      as: 'phone'
    });

    PhoneOwner.belongsTo(models.PhoneOwnerType, {
      foreignKey: 'owner_type_id',
      as: 'type'
    });

    // Aqui podemos resolver dinamicamente o owner depois, se quiseres
  };

  return PhoneOwner;
};
