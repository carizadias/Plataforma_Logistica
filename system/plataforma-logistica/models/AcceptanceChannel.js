'use strict';

module.exports = (sequelize, DataTypes) => {
    const AcceptanceChannel = sequelize.define('AcceptanceChannel', {
        acceptance_channel_id: {
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
            allowNull:false,
            defaultValue: true,
        }
    }, {
        tableName: 'acceptance_channels',
        timestamps: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    AcceptanceChannel.associate = (models) =>{

        AcceptanceChannel.belongsToMany(models.SubService, {
            through: 'sub_service_acceptance_channel',
            foreignKey: 'acceptance_channel_id',
            otherKey: 'sub_service_id',
            as: 'subServices',
        });
    };

    return AcceptanceChannel;
};
