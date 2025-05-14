// models/user_role.js
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users', // Nome da tabela users
        key: 'user_id', // Referência ao campo user_id da tabela users
      },
      allowNull: false,
    },
    user_type: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      references: {
        model: 'user_types', // Nome da tabela user_types
        key: 'name', // Referência ao campo name da tabela user_types
      },
      allowNull: false,
    },
  }, {
    tableName: 'user_roles',
    timestamps: false, // Não vamos usar timestamps para essa tabela
    primaryKey: ['user_id', 'user_type'], // Chave primária composta
  });

  // Definindo a associação com User e UserType
  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    UserRole.belongsTo(models.UserType, {
      foreignKey: 'user_type',
      as: 'type',
    });
  };

  return UserRole;
};
