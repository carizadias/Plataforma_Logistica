module.exports = (sequelize, DataTypes) => {
    const Subservice = sequelize.define('SubService', {
        subservice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'subservices',
        timestamps: false
    });
    return Subservice;
};
