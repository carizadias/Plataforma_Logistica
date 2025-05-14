module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postal_company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        underscored: true,
//        paranoid: true
    });

    Service.associate = (models) => {
        Service.belongsTo(models.PostalCompany, {//um serviço pertence a um postal company
            foreignKey: 'service_id',
            as: 'postalCompany'
        });

        // Adicionar o relacionamento com SubService através da tabela intermediária
        Service.hasMany(models.SubService, {
            foreignKey: 'service_id', // chave estrangeira no modelo SubService
            as: 'subServices', // alias para a associação
            timestamps: false
        });
    };


    return Service;
};
