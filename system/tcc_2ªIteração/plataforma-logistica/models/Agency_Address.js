// models/AgencyAddress.js
module.exports = (sequelize, DataTypes) => {
  const AgencyAddress = sequelize.define('AgencyAddress', {
    agency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'agencies', // Supondo que você tenha o modelo 'Agency'
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
  });

  AgencyAddress.associate = function(models) {
    // Define a associação com o modelo Agency
    AgencyAddress.belongsTo(models.Agency, {
      foreignKey: 'agency_id',
      as: 'agency'
    });

    // Define a associação com o modelo Address
    AgencyAddress.belongsTo(models.Address, {
      foreignKey: 'address_id',
      as: 'address'
    });
  };

  return AgencyAddress;
};
