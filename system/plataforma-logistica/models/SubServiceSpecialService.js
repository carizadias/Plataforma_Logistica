module.exports = (sequelize, DataTypes) => {
    const SubServiceSpecialService = sequelize.define('SubServiceSpecialService', {
        sub_service_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'sub_services',
                key: 'sub_service_id',
            },
        },
        special_service_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'special_services',
                key: 'special_service_id',
            },
        },
    }, {
        tableName: 'sub_service_special_service',
        timestamps: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    return SubServiceSpecialService;
};
