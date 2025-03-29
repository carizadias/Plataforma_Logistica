module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    currency_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    currency_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    currency_symbol: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'currencies',
    timestamps: false
  });

  return Currency;
};
