'use strict';

module.exports = (sequelize, DataTypes) => {
    const CoverageType = sequelize.define('CoverageType', {
        coverage_type_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // deve ser unico?🤔
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        tableName: 'coverage_types',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    CoverageType.associate=(models)=>{

        CoverageType.belongsToMany(models.CoverageType, {
            through: 'sub_service_coverage_type',
            foreignKey: 'coverage_type_id',
            otherKey: 'sub_service_id',
            as: 'subServices',
        });
    };

    return CoverageType;
};
