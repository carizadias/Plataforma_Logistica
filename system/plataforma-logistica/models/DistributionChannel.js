'use strict';

module.exports = (sequelize, DataTypes) => {
    const DistributionChannel = sequelize.define('DistributionChannel', {
        distribution_channel_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        tableName: 'distribution_channels',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    DistributionChannel.associate = (models) =>{

        DistributionChannel.belongsToMany(models.SubService, {
            through: 'sub_service_distribution_channel',
            foreignKey: 'distribution_channel_id',
            otherKey: 'sub_service_id',
            as: 'subServices',
        });
    };

    return DistributionChannel;
};
