module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
          user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          nif: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          surname: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          phone_number_id: {
            type: DataTypes.INTEGER,
            references: {
              model: 'phone_numbers',
              key: 'phone_number_id',
            },
          },
          profile_picture: {
            type: DataTypes.STRING,
          },
          address_id: {
            type: DataTypes.INTEGER,
            references: {
              model: 'address',
              key: 'address_id',
            },
          },
          type: {
            type: DataTypes.STRING,
            references: {
              model: 'user_type',
              key: 'name',
            },
            field: 'type',
          },
          is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          resetToken: {
            type: DataTypes.STRING,
          },
          resetTokenExpire: {
            type: DataTypes.DATE,
          },

}, {
  tableName: 'users',
  timestamps: false,

});

User.associate = (models) => {
  User.belongsToMany(models.UserType, {
      through: models.UserRoles,
      foreignKey: "user_id",
      otherKey: "user_type",
      as: "roles",
  });
  
};


return User
};

