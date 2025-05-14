module.exports = (sequelize, DataTypes) => {
    const SubServiceSpecialService = sequelize.define('SubServiceSpecialService', {
        sub_service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        special_service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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
        tableName: 'sub_service_special_service',
        timestamps: false,
    });

    return SubServiceSpecialService;
};
