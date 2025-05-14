module.exports = (sequelize, DataTypes) => {
    const SubService = sequelize.define('SubService', {
        sub_service_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        service_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'services',
                key:'service_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'//sim um subserviço pertence a um serviço se apagado o pai já não deve existir
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'sub_services',
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

    SubService.associate = (models) => {

        SubService.hasMany(models.Fee, { foreignKey: 'sub_service_id', as: 'fees' });

        SubService.belongsTo(models.Service, {foreignKey: 'service_id',as: 'service'});

        SubService.belongsToMany(models.SpecialService, {
            through: 'sub_service_special_service',
            foreignKey: 'sub_service_id',
            otherKey: 'special_service_id',
            as: 'specialServices',
        });

        SubService.belongsToMany(models.DistributionChannel, {
            through: 'sub_service_distribution_channel',
            foreignKey: 'sub_service_id',
            otherKey: 'distribution_channel_id',
            as: 'distributionChannels',
        });

        SubService.belongsToMany(models.AcceptanceChannel, {
            through: 'sub_service_acceptance_channel',
            foreignKey: 'sub_service_id',
            otherKey: 'acceptance_channel_id',
            as: 'acceptanceChannels',
        });

        SubService.belongsToMany(models.CoverageType, {
            through: 'sub_service_coverage_type',
            foreignKey: 'sub_service_id',
            otherKey: 'coverage_type_id',
            as: 'coverageTypes',
        });

        SubService.belongsToMany(models.CoverageArea, {
            through: 'sub_service_coverage_type',
            foreignKey: 'sub_service_id',
            otherKey: 'coverage_area_id',
            as: 'coverageAreas',
        });

    };


    return SubService;
};
