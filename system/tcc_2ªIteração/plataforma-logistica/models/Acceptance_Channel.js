module.exports = (sequelize, DataTypes) => {
    const AcceptanceChannel = sequelize.define('AcceptanceChannel', {
        acceptance_channel_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'acceptance_channels',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return AcceptanceChannel;
};
