module.exports = (sequelize, DataTypes) =>{
    const Continent = sequelize.define('Continent', {
        continent_id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        is_active:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName:'continents',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    Continent.associate=(models)=>{

        Continent.hasMany(models.Country,{foreignKey:'continent_id',as:'countries'});
    };
    return Continent;
};