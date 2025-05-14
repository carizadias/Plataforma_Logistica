module.exports = (sequelize, DataTypes) => {
    const SubServiceCoverageArea = sequelize.define('SubServiceCoverageArea', {
        sub_service_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references:{
                model:'sub_services',
                key:'sub_service_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        coverage_area_id: {
            type: DataTypes.UUID,
            allowNull:false,
            primaryKey: true,
            references:{
                model:'coverage_areas',
                key:'coverage_area_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        },
    }, {
        tableName: 'sub_service_coverage_area',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    return SubServiceCoverageArea;
};
