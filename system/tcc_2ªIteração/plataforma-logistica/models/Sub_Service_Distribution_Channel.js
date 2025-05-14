
module.exports = (sequelize, DataTypes) => {
  const SubserviceDistributionChannel = sequelize.define('SubserviceDistributionChannel', {
    subservice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Subservices',
        key: 'subservice_id',
      },
    },
    distribution_channel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DistributionChannels',
        key: 'distribution_channel_id',
      },
    },
  }, {
    tableName: 'subservice_distribution_channel',
    timestamps: false,
  });

  SubserviceDistributionChannel.associate = (models) => {
    SubserviceDistributionChannel.belongsTo(models.SubService, {
      foreignKey: 'subservice_id',
    });

    SubserviceDistributionChannel.belongsTo(models.DistributionChannel, {
      foreignKey: 'distribution_channel_id',
    });
  };

  return SubserviceDistributionChannel;
};
