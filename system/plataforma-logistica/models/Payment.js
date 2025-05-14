module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        payment_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        payment_method_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'payment_methods',
                key:'payment_method_id'
            },
            onUpdate:'CASCADE',
            onDelete:'RESTRICT'
        },
        payment_status_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'payment_status',
                key:'payment_status_id'
            },
            onUpdate:'CASCADE',
            onDelete: 'RESTRICT'
        },
        currency_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'currencies',
                key:'currency_id'
            },
            onUpdate:'CASCADE',
            onDelete:'RESTRICT'
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: 'payments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    Payment.associate = (models) => {

        Payment.hasOne(models.Order, {foreignKey: 'payment_id',as: 'order'});
        Payment.belongsTo(models.PaymentMethod, {foreignKey: 'payment_method_id',as: 'method'});
        Payment.belongsTo(models.PaymentStatus, {foreignKey: 'payment_status_id',as: 'status'});
        Payment.belongsTo(models.Currency, {foreignKey: 'currency_id',as: 'currency'});
    };

    return Payment;
};
