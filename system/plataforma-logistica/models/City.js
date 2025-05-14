module.exports= (Sequelize, DataTypes) =>{
    const City = Sequelize.define("City",{
        city_id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        state_id:{
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'states',
                key:'state_id'
            },
            onUpdate:'CASCADE',
            onDelete: 'CASCADE'
        },
        name:{//unico?
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },{
        tableName: 'cities',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
        indexes:[
            {
                fields:['name']
            },     
        ]
    });

    City.associate = (models) =>{

        City.hasMany(models.Neighborhood, {foreignKey:'city_id',as:'neighborhoods'});

        City.belongsTo(models.Country, {foreignKey: 'city_id', as: 'country'});
    }
    return City;
};