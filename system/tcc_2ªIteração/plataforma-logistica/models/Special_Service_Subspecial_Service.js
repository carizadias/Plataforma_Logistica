module.exports = (sequelize, DataTypes) => {
  const SpecialServiceSubspecialService = sequelize.define(
    "SpecialServiceSubSpecialService",
    {
      special_service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,

      },
      subspecial_service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,

      },
    },
    {
      tableName: "special_service_subspecial_service",
      timestamps: false,
    }
  );

  SpecialServiceSubspecialService.associate = (models) => {
    SpecialServiceSubspecialService.belongsTo(models.SpecialService, {
      foreignKey: "special_service_id",
    });

    SpecialServiceSubspecialService.belongsTo(models.SubSpecialService, {
      foreignKey: "subspecial_service_id",
    });
  };

  return SpecialServiceSubspecialService;
};
