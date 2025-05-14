module.exports = (sequelize, DataTypes) => {
    const SubSpecialService = sequelize.define('SubSpecialService', {
        sub_special_service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
        tableName: 'sub_special_services',
        timestamps: false,
        //colocar deleted at e paranoid true 
    });

    SubSpecialService.associate = (models) => {
        // SubSpecialService tem muitos SpecialServices (muitos para muitos)
        SubSpecialService.belongsToMany(models.SpecialService, {
            through: 'special_service_sub_special_service',
            foreignKey: 'sub_special_service_id',
            otherKey: 'special_service_id',
            as: 'specialServices',
            timestamps: false,
        });
    };

    return SubSpecialService;
};
