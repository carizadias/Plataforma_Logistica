module.exports = (sequelize, DataTypes) => {
    const Gender = sequelize.define('Gender', {
        gender_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'genders',
        timestamps: false
    });

    return Gender;
};
