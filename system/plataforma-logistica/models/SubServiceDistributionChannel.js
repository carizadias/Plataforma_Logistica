'use strict';

module.exports = (sequelize, DataTypes) => {
    const SubServiceDistributionChannel = sequelize.define('SubServiceDistributionChannel', {
        sub_service_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references:{
                model:'sub_services',
                key:'sub_service_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        },
        distribution_channel_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references:{
                model:'distribution_channels',
                key:'distribution_channel_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        }
    }, {
        tableName: 'sub_service_distribution_channels',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    return SubServiceDistributionChannel;
};
