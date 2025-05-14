module.exports = (sequelize, DataTypes) => {
    const SpecialService = sequelize.define('SpecialService', {
        special_service_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'special_services',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
        indexes: [
            {
                fields: ['name']
            }
        ]
    });

    SpecialService.associate = (models) => {
        
        SpecialService.belongsToMany(models.SubService, {
            through: 'sub_service_special_service',
            foreignKey: 'special_service_id',
            otherKey: 'sub_service_id',
            as: 'subServices',
        });

        SpecialService.belongsToMany(models.SubSpecialService, {
            through: 'special_service_sub_special_service',
            foreignKey: 'special_service_id',
            otherKey: 'sub_special_service_id',
            as: 'subSpecialServices',
        });

    };

    return SpecialService;
};
