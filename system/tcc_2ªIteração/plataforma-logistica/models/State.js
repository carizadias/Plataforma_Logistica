module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define('State', {
        state_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'states',
        timestamps: false
    });

    State.associate = function(models) {
        State.hasMany(models.City, {
            foreignKey: 'state_id',
            as: 'cities'
        });
    };

    return State;
};
