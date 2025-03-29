module.exports = (sequelize, DataTypes) => {
  const SubserviceCoverage = sequelize.define('SubServiceCoverage', {
    subservice_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,

    },
    coverage_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,

    }
  }, {
    tableName: 'subservice_coverage',
    timestamps: false
  });


  return SubserviceCoverage;
};
