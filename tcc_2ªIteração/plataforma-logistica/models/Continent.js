module.exports = (sequelize, DataTypes) => {
  const Continent = sequelize.define('Continent', {
    continent_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    continent_name: {
      type: DataTypes.STRING,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'continents',
    timestamps: false,
  });

  return Continent;
};
