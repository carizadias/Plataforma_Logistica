// models/common_user_data.js
module.exports = (sequelize, DataTypes) => {
  const CommonUserData = sequelize.define('CommonUserData', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // user_id é a chave primária
      references: {
        model: 'users', // Nome da tabela users
        key: 'user_id', // Referência ao campo user_id da tabela users
      },
      allowNull: false,
    },
    address_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'addresses', // Nome da tabela address
        key: 'address_id', // Referência ao campo address_id da tabela address
      },
      allowNull: false, // O campo pode ser nulo
    },
    phone_number_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'phone_numbers', // Nome da tabela phone_numbers
        key: 'phone_number_id', // Referência ao campo phone_number_id da tabela phone_numbers
      },
      allowNull: false, // O campo pode ser nulo
    },
    nif: {
      type: DataTypes.STRING(20),
      allowNull: false, // O campo pode ser nulo
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetTokenExpire: {
      type: DataTypes.DATE,
      allowNull: true
    }
    
  }, {
    tableName: 'common_user_data',
    timestamps: false, // Não vamos usar timestamps para essa tabela
  });

  // Definindo a associação com o modelo User
  CommonUserData.associate = (models) => {
    CommonUserData.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user', // Alias para a associação
    });
    CommonUserData.belongsTo(models.Address, {
      foreignKey: 'address_id',
      as: 'address', // Alias para a associação
    });
    CommonUserData.belongsTo(models.PhoneNumber, {
      foreignKey: 'phone_number_id',
      as: 'phone_number', // Alias para a associação
    });
  };

  return CommonUserData;
};
