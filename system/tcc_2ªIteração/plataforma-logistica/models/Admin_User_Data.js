// models/admin_user_data.js
module.exports = (sequelize, DataTypes) => {
  const AdminUserData = sequelize.define('AdminUserData', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admin_user_data',
        key: 'user_id',
      },
    },
  }, {
    tableName: 'admin_user_data',
    timestamps: false,
  });

  AdminUserData.associate = (models) => {
    AdminUserData.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    AdminUserData.belongsTo(models.AdminUserData, {
      foreignKey: 'created_by',
      as: 'creator',
    });
  };

  return AdminUserData;
};
