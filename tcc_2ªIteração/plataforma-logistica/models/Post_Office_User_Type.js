module.exports = (sequelize, DataTypes) => {
  const PostOfficeUserType = sequelize.define("PostOfficeUserType", {
    post_office_user_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "post_office_user_types",
    timestamps: false,
  });

  PostOfficeUserType.associate = (models) => {
    PostOfficeUserType.belongsToMany(models.PostOfficeUser, {
        through: models.PostOfficeUserRoles,
        foreignKey: "post_office_user_type_id",
        otherKey: "post_office_user_id",
        as: "users",
    });
};


  return PostOfficeUserType;
};
