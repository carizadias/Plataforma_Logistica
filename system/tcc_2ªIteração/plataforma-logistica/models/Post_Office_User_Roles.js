module.exports = (sequelize, DataTypes) => {
  const PostOfficeUserRoles = sequelize.define("PostOfficeUserRoles", {
    post_office_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "post_office_users",
        key: "post_office_user_id",
      },
    },
    post_office_user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "post_office_user_type",
        key: "post_office_user_type_id",
      },
    },
  }, {
    tableName: "post_office_user_roles",
    timestamps: false,
  });

  return PostOfficeUserRoles;
};
