module.exports = (sequelize, DataTypes) => {
    const SubServiceCoverage = sequelize.define('SubServiceCoverageType', {
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
        coverage_type_id: {
            type: DataTypes.UUID,
            allowNull:false,
            primaryKey: true,
            references:{
                model:'coverage_types',
                key:'coverage_type_id'
            },
            onUpdate: 'CASCADE',
            onDelete:'CASCADE'
        },
    }, {
        tableName: 'sub_service_coverage_type',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    });

    return SubServiceCoverage;
};
