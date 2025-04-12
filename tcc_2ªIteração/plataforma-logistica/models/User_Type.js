// models/user_type.js
module.exports = (sequelize, DataTypes) => {
  const UserType = sequelize.define('UserType', {
    name: {
      type: DataTypes.STRING(50),
      primaryKey: true, // O nome é a chave primária
    },
  }, {
    tableName: 'user_types',
    timestamps: false, // Não vamos usar timestamps para essa tabela
  });

  return UserType;
};
