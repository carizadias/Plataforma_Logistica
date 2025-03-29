module.exports = (sequelize, DataTypes) => {
  const PostOffice = sequelize.define('PostOffice', {
    post_office_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coverage_area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fee: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rejected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'post_offices',
    timestamps: false,
  });

  PostOffice.associate = (models) => {
    PostOffice.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
  };

  return PostOffice;
};
