module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
        country_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        continent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'continents',
                key:'continent_id'
            }
        },
        area: {
            type: DataTypes.STRING,
            allowNull: true
        },
        currency_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            refrences:{
                model:'currencies',
                key:'currency_id'
            }
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        phone_number_code: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,//🤔 refrences country_types or national international?
        }
    }, {
        tableName: 'countries',
        timestamps: false
    });

    return Country;
};
