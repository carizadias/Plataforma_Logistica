module.exports = (sequelize, DataTypes) => {
    const PaymentMethod = sequelize.define('PaymentMethod', {
        payment_method_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'payment_methods',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    PaymentMethod.associate=(models)=>{

        PaymentMethod.hasMany(models.Payment,{foreignKey:'payment_method_id',as:'payments'});
        
    };

    return PaymentMethod;
};
