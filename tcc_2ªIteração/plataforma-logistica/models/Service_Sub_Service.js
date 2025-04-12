module.exports = (sequelize, DataTypes) => {
  const ServiceSubService = sequelize.define('ServiceSubService', {
    service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Services', // Nome da tabela Services
        key: 'service_id'  // Referência à chave primária da tabela Services
      }
    },
    sub_service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'SubServices', // Nome da tabela SubServices
        key: 'sub_service_id'  // Referência à chave primária da tabela SubServices
      }
    }
  }, {
    tableName: 'service_sub_service',
    timestamps: false,
  });

  return ServiceSubService;
};
