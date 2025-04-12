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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'services',
    timestamps: false,
  });

  Service.associate = (models) => {
    Service.belongsToMany(models.PostOffice, {
      through: 'post_office_service',
      foreignKey: 'service_id',
      otherKey: 'post_office_id',
      as: 'post_offices'
    });

    // Adicionar o relacionamento com SubService através da tabela intermediária
    Service.belongsToMany(models.SubService, {
      through: 'service_sub_service',
      foreignKey: 'service_id', // chave estrangeira no modelo SubService
      otherKey: 'sub_service_id',
      as: 'subServices', // alias para a associação
      timestamps: false
    });
  };


  return Service;
};
