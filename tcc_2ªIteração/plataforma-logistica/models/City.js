module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define('City', {
        city_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        state_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'states',
                key:'state_id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        neighborhood: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zipcode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cep: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'cities',
        timestamps: false
    });

    return City;
};
