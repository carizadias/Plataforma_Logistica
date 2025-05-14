module.exports = (sequelize, DataTypes) => {
  const ServiceSubservice = sequelize.define('service_subservice', {
    service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,

    },
    subservice_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,

    }
  }, {
    tableName: 'service_subservice',
    timestamps: false,
  });

  return ServiceSubservice;
};
