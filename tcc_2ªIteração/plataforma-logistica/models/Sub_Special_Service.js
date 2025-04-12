module.exports = (sequelize, DataTypes) => {
  const SubSpecialService = sequelize.define("SubSpecialService", {
    sub_special_service_id: {
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
    tableName: "sub_special_service",
    timestamps: false,
  });

  SubSpecialService.associate = (models) => {
    SubSpecialService.belongsToMany(models.SpecialService, {
        through: 'special_service_sub_special_service',
        foreignKey: 'sub_special_service_id',
        otherKey: 'special_service_id',
        as: 'subSpecialServices',
        timestamps: false
    });
};

  return SubSpecialService;
};
