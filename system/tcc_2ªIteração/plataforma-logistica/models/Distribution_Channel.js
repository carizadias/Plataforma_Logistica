module.exports = (sequelize, DataTypes) => {
  const DistributionChannel = sequelize.define('DistributionChannel', {
    distribution_channel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    distribution_channel_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'distribution_channels',
    timestamps: false,
  });

  return DistributionChannel;
};
