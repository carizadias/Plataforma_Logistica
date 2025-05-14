module.exports = (sequelize, DataTypes) => {
    const CoverageCategory = sequelize.define('CoverageCategory', {
        category_id: {
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
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'coverage_category',
        timestamps: false
    });

    return CoverageCategory;
};
