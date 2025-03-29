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


  return SpecialService;
};
