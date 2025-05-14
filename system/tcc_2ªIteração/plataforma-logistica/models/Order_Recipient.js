module.exports = (sequelize, DataTypes) => {
    const OrderRecipient = sequelize.define('OrderRecipient', {
        recipient_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'order_recipients',
        timestamps: false,
        underscored: true,
    });

    OrderRecipient.associate = (models) => {
        OrderRecipient.belongsTo(models.User, {
            foreignKey: 'recipient_id',
            as: 'recipient'
        });
        OrderRecipient.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });
    };

    return OrderRecipient;
};
