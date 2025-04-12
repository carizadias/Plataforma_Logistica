// models/user.js
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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_picture_id: {
      type: DataTypes.INTEGER,
      references:{
        model:'profile_pictures',
        key:'profile_picture_id'
      },
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'users',
    timestamps: false, // We define 'created_at' and 'updated_at' manually
  });

  User.associate = (models) => {
    // Definindo a associação entre o User e ProfilePicture
    User.belongsTo(models.ProfilePicture, {
      foreignKey: 'profile_picture_id',
      as: 'profile_picture',
    });
    User.hasMany(models.UserRole, { foreignKey: 'user_id', as: 'roles' });

    User.belongsToMany(models.Address, {
      through: 'user_addresses', // Tabela intermediária
      foreignKey: 'user_id',
      otherKey: 'address_id',
      as: 'addresses',
      timestamps: false
    });

  };
  

  return User;
};
