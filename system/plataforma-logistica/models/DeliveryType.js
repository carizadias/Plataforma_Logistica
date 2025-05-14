module.exports = (sequelize, DataTypes) => {
    const DeliveryType = sequelize.define('DeliveryType', {
        delivery_type_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {//unique?
            type: DataTypes.STRING(100),
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'delivery_types',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
        indexes:[
            {
                fields:['name']
            }
        ]
    });

    DeliveryType.associate=(models)=>{
    
        DeliveryType.hasMany(models.Order,{foreignKey:'delivery_type_id',as:'orders'})
    };

    return DeliveryType;
};
