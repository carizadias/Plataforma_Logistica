// models/post_office_employee_data.js
module.exports = (sequelize, DataTypes) => {
  const PostOfficeEmployeeData = sequelize.define('PostOfficeEmployeeData', {
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
    tableName: 'post_office_employee_data',
    timestamps: false,
  });

  PostOfficeEmployeeData.associate = (models) => {
    PostOfficeEmployeeData.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    PostOfficeEmployeeData.belongsTo(models.PostOffice, {
      foreignKey: 'post_office_id',
      as: 'post_office',
    });
  };

  return PostOfficeEmployeeData;
};
