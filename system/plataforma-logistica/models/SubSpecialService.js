module.exports = (sequelize, DataTypes) => {
    const SubSpecialService = sequelize.define('SubSpecialService', {
        sub_special_service_id: {
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
        }
    }, {
        tableName: 'sub_special_services',
        timestamps: false,
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

    SubSpecialService.associate = (models) => {
        
        SubSpecialService.belongsToMany(models.SpecialService, {
            through: 'special_service_sub_special_service',
            foreignKey: 'sub_special_service_id',
            otherKey: 'special_service_id',
            as: 'specialServices',
        });
    };

    return SubSpecialService;
};
