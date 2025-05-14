'use strict';

module.exports = (sequelize, DataTypes) => {
    const ClientUserData = sequelize.define('ClientUserData', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        nif: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        reset_token: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        reset_token_expire: {
            type: DataTypes.DATE,
            allowNull: true
        },
        
    }, {
        tableName: 'client_user_data',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    ClientUserData.associate = (models) => {
        ClientUserData.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return ClientUserData;
};
