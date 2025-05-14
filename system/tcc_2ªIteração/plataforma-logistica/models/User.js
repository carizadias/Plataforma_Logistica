module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_picture_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'files',
        key: 'file_id'
      },
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password_is_temporary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_changed_password: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  });

  User.associate = (models) => {
    User.hasMany(models.UserRole, {
      foreignKey: 'user_id',
      as: 'roles',
    });

    User.belongsTo(models.File, {
      foreignKey: 'profile_picture_id',
      as: 'profile_picture',
    });

    User.belongsTo(models.User, {
      foreignKey: 'created_by_user_id',
      as: 'creator',
    });

    // Encomendas enviadas
    User.hasMany(models.Order, {
      foreignKey: 'sender_id',
      as: 'sent_orders',
    });

    // Ligações com encomendas recebidas
    User.hasMany(models.OrderRecipient, {
      foreignKey: 'recipient_id',
      as: 'received_orders',
    });

    User.belongsToMany(models.Address, {
      through: 'user_address',
      foreignKey: 'user_id',
      otherKey: 'address_id',
      as: 'addresses'
    });

    User.hasMany(models.PhoneNumber, {
      foreignKey: 'user_id',
      as: 'phone_numbers',
    });
    

  };
  return User;
}