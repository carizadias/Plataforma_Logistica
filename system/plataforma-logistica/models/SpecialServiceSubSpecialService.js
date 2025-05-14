module.exports = (sequelize, DataTypes) => {
    const SpecialServiceSubSpecialService = sequelize.define('SpecialServiceSubSpecialService', {
        special_service_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references:{
                model:'special_services',
                key:'special_service_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        sub_special_service_id: {
            type: DataTypes.UUID,
            allowNull:false,
            primaryKey: true,
            references:{
                model:'sub_special_services',
                key:'sub_special_service_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        },
    }, {
        tableName: 'special_service_sub_special_service',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    return SpecialServiceSubSpecialService;
};
