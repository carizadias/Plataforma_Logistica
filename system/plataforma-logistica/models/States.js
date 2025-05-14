module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define('State', {
        state_id: {
            type: DataTypes.UUID,
            defaultValues: DataTypes.UUIDV4,
            primaryKey: true
        },
        country_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'countries',
                key: 'country_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'//se apagar country apaga seus estados
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'states',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
        indexes:[
            {
                fields:['name']
            }
        ]
    });

    State.associate = (models) =>{

        State.hasMany(models.City, {foreignKey:'sate_id',as:'cities'});
        
        State.belongsTo(models.Country,{foreignKey:'country_id', as:'country'});
    };
    return State;
};