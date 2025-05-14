module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        payment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        payment_method_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        payment_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        currency_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        defaultValue: 1 // Assuming 1 is the default currency (e.g., EUR)
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'payments',
        timestamps: false
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.PaymentMethod, {
            foreignKey: 'payment_method_id',
            as: 'method'
        });
        Payment.belongsTo(models.PaymentStatus, {
            foreignKey: 'payment_status_id',
            as: 'status'
        });
        // Payment.belongsTo(models.Currency, {
        //     foreignKey: 'currency_id',
        //     as: 'currency'
        // });
    };

    return Payment;
};
