// models/agency.js
module.exports = (sequelize, DataTypes) => {
  const Agency = sequelize.define('Agency', {
    agency_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    post_office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post_offices',
        key: 'post_office_id'
      }
    }
  }, {
    tableName: 'agencies',
    timestamps: false
  });

  Agency.associate = (models) => {
    Agency.belongsTo(models.PostOffice, {
      foreignKey: 'post_office_id',
      as: 'post_office'
    });
    // Relacionamento com os endereços das agências
    Agency.belongsToMany(models.Address, {
      through: 'agency_addresses', // Tabela intermediária
      foreignKey: 'agency_id',     // Chave estrangeira que aponta para a tabela 'agencies'
      otherKey: 'address_id',      // Chave estrangeira que aponta para a tabela 'addresses'
      as: 'addresses'  ,// Alias para o relacionamento
      timestamps: false       //abilitar depois pq posso querer utilizar o creted at e updated at depois     
    });
  };

  return Agency;
};
