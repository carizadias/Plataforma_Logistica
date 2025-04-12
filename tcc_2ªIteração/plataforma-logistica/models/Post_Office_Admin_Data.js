// models/post_office_admin_data.js
module.exports = (sequelize, DataTypes) => {
  const PostOfficeAdminData = sequelize.define('PostOfficeAdminData', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    post_office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post_offices',
        key: 'post_office_id',
      },
    },
  }, {
    tableName: 'post_office_admin_data',
    timestamps: false,
  });

  PostOfficeAdminData.associate = (models) => {
    PostOfficeAdminData.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    PostOfficeAdminData.belongsTo(models.PostOffice, {
      foreignKey: 'post_office_id',
      as: 'post_office',
    });
  };

  return PostOfficeAdminData;
};
