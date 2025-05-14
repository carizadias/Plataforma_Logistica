module.exports = (sequelize, DataTypes) => {
  const CoverageAssociation = sequelize.define('CoverageAssociation', {
    coverage_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    association_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    association_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    tableName: 'coverage_association',
    timestamps: false
  });

  return CoverageAssociation;
};
