module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        service_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        postal_company_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:'postal_companies',
                key:'postal_company_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'//se apagar postal company apaga os seus serviços tb
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'services',
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

    Service.associate = (models) => {

        Service.belongsTo(models.PostalCompany, {foreignKey: 'postal_company_id', as: 'postalCompany'});

        Service.hasMany(models.SubService, {foreignKey: 'service_id',as: 'subServices'});
    };


    return Service;
};
