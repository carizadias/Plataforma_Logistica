module.exports = (sequelize, DataTypes) => {
    const Neighborhood = sequelize.define("Neighborhood", {
        neighborhood_id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        city_id:{
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'cities',
                key:'city_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        name:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        tableName: 'neighborhoods',
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

    Neighborhood.associate = (models) =>{

        Neighborhood.hasMany(models.Address,{foreignKey:'neighborhood_id',as:'addresses'});
        Neighborhood.hasMany(models.ZipCode,{foreignKey:'neighborhood_id',as:'zipCodes'});

        Neighborhood.belongsTo(models.City,{foreignKey:'city_id',as:'city'})

    };

    return Neighborhood;
};