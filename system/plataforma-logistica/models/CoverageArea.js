'use strict';

module.exports = (sequelize, DataTypes) => {
    const CoverageArea = sequelize.define('CoverageArea', {
        coverage_area_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        tableName: 'coverage_areas',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt:'deleted_at',
        underscored: true,
        paranoid: true,
        indexes:[
            {
                fields:['name']
            }
        ]
    });

    CoverageArea.associate=(models)=>{

        CoverageArea.belongsToMany(models.SubService, {
            through: 'sub_service_coverage_type',
            foreignKey: 'coverage_area_id',
            otherKey: 'sub_service_id',
            as: 'subServices',
        });

    };

    return CoverageArea;
};
