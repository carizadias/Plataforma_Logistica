'use strict';

module.exports = (sequelize, DataTypes) => {
    const CountryType = sequelize.define('CountryType', {
        country_type_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {//unique?
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        tableName: 'country_types',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    CountryType.associate=(models)=>{

        CountryType.hasMany(models.Country,{foreignKey:'country_type_id',as:'countries'});
    };

    return CountryType;
};
