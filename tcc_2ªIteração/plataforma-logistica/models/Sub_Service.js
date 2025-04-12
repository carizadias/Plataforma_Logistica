module.exports = (sequelize, DataTypes) => {
    const SubService = sequelize.define('SubService', {
        sub_service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'sub_services',
        timestamps: false
    });

    SubService.associate = (models) => {
        SubService.belongsToMany(models.Service, {
            through: 'service_sub_service',
            foreignKey: 'sub_service_id',
            otherKey: 'service_id',
            as: 'subServices'
        });

        SubService.belongsToMany(models.SpecialService, {
            through: 'sub_service_special_service',
            foreignKey: 'sub_service_id',
            otherKey: 'special_service_id',
            as: 'specialServices',
            timestamps: false
        });
    };
    return SubService;
};
