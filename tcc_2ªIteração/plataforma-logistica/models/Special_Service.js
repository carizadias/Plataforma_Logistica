module.exports = (sequelize, DataTypes) => {
  const SpecialService = sequelize.define('SpecialService', {
    special_service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'special_services',
    timestamps: false
  });

  SpecialService.associate = (models) => {
    SpecialService.belongsToMany(models.SubService, {
        through: 'sub_service_special_service',
        foreignKey: 'special_service_id',
        otherKey: 'sub_service_id',
        as: 'specialServices',
        timestamps: false
    });

    SpecialService.belongsToMany(models.SubSpecialService, {
      through: 'special_service_sub_special_service',
      foreignKey: 'special_service_id',
      otherKey: 'sub_special_service_id',
      as: 'subSpecialServices',
      timestamps: false
  });
};


  return SpecialService;
};
