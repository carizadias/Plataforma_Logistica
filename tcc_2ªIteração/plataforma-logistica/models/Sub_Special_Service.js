module.exports = (sequelize, DataTypes) => {
  const SubspecialService = sequelize.define("SubSpecialService", {
    subspetial_service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: "subspecial_service",
    timestamps: false,
  });

  return SubspecialService;
};
