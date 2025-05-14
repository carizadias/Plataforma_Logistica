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
            type: DataTypes.STRING,
            allowNull: false
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'sub_services',
        timestamps: false,
    });

    SubService.associate = (models) => {
        SubService.belongsTo(models.Service, {//um serviço pertence a um postal company
            foreignKey: 'service_id',
            as: 'service',
            timestamps: false
        });

        // SubService has many SpecialServices (muitos para muitos)
        SubService.belongsToMany(models.SpecialService, {
            through: 'sub_service_special_service',
            foreignKey: 'sub_service_id',
            otherKey: 'special_service_id',
            as: 'specialServices',
            timestamps: false
        });

        SubService.hasMany(models.Fee, { foreignKey: 'sub_service_id', as: 'fees' });
    };


    return SubService;
};
