module.exports = (sequelize, DataTypes) => {
    const OrderRecipient = sequelize.define('OrderRecipient', {
        recipient_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references:{
                model:'users',
                key:'user_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        },
        order_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references:{
                model:'orders',
                key:'order_id'
            },
            onUpdate:'CASCADE',
            onDelete:'CASCADE'
        }
    }, {
        tableName: 'order_recipients',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',//é uma tabela associativa mas também é o unico registro de destinatário
        underscored: true,

    });
    return OrderRecipient;
};
