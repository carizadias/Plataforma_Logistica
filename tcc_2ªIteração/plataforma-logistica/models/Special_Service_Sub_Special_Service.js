module.exports = (sequelize, DataTypes) => {
  const SpecialServiceSubSpecialService = sequelize.define(
    "SpecialServiceSubSpecialService",
    {
      special_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'special_services',
          key: 'special_service_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sub_special_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'sub_special_service',
          key: 'sub_special_service_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: "special_service_sub_special_service",
      timestamps: false,
    }
  );

  //usar apenas se for instanciar diretamente a tabela intermediaria
  // SpecialServiceSubSpecialService.associate = (models) => {
  //   SpecialServiceSubSpecialService.belongsTo(models.SpecialService, {
  //     foreignKey: "special_service_id",
  //   });

  //   SpecialServiceSubSpecialService.belongsTo(models.SubSpecialService, {
  //     foreignKey: "sub_special_service_id",
  //   });
  // };

  return SpecialServiceSubSpecialService;
};
