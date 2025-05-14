module.exports = (sequelize, DataTypes) => {
    const SpecialServiceSubSpecialService = sequelize.define('SpecialServiceSubSpecialService', {
        special_service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        sub_special_service_id: {
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
        tableName: 'special_service_sub_special_service',
        timestamps: false,
    });

    return SpecialServiceSubSpecialService;
};
