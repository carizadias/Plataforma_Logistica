module.exports = (sequelize, DataTypes) => { 
  const UserType = sequelize.define("UserType", {

    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },

  }, {
    tableName: "user_types",
    timestamps: false,
  });


  UserType.associate = (models) => {
    UserType.belongsToMany(models.User, {
      through: models.UserRoles,
      foreignKey: "user_type",
      otherKey: "user_id",
    });
  };

  return UserType;
};
