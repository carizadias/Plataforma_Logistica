module.exports = (sequelize, DataTypes) => {
  const SubserviceSpecialService = sequelize.define('SubServiceSpecialService', {
    subservice_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,

    },
    spetial_service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,

    },
  }, {
    tableName: 'subservice_special_service',
    timestamps: false,
  });

  return SubserviceSpecialService;
};
