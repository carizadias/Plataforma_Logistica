module.exports = (sequelize, DataTypes) => {
    const PaymentStatus = sequelize.define('PaymentStatus', {
        payment_status_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'payment_status',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    PaymentStatus.associate=(models)=>{

        PaymentStatus.hasMany(models.Payment,{foreignKey:'payment_status_id',as:'payments'})
    };

    return PaymentStatus;
};
