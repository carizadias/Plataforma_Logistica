'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProfilePicture = sequelize.define('ProfilePicture', {
    profile_picture_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  }, {
    tableName: 'profile_pictures',
    timestamps: false, // se não estiveres a usar createdAt/updatedAt
  });

  //Se no futuro quiseres associar com o User, por exemplo:
//   ProfilePicture.associate = (models) => {
//     ProfilePicture.belongsTo(models.User, {
//       foreignKey: 'user_id',
//       as: 'user'
//     });
//   };

  return ProfilePicture;
};
