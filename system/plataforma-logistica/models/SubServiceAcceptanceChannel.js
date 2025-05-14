'use strict';

module.exports = (sequelize, DataTypes) => {
    const SubServiceAcceptanceChannel = sequelize.define('SubServiceAcceptanceChannel', {
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
        acceptance_channel_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references:{
                model:'acceptance_channels',
                key:'acceptance_channel_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        }
    }, {
        tableName: 'sub_service_acceptance_channels',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    return SubServiceAcceptanceChannel;
};
