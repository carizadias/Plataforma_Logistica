module.exports = (sequelize, DataTypes) => {
  const SubserviceSpecialService = sequelize.define('SubServiceSpecialService', {
    sub_service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'SubServices', // Nome da tabela referenciada
        key: 'sub_service_id' // Chave primária na tabela referenciada
      }
    },
    special_service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'SpecialServices', // Nome da tabela referenciada
        key: 'special_service_id' // Chave primária na tabela referenciada
      }
    },
  }, {
    tableName: 'subservice_special_service',
    timestamps: false,
  });

  return SubserviceSpecialService;
};
