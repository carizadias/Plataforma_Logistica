module.exports = (sequelize, DataTypes) => { 
  const PostOfficeService = sequelize.define('PostOfficeService', {
    service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    service_code: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    }
  }, {
    tableName: 'post_office_service',
    timestamps: false,
  });

  PostOfficeService.associate = function(models) {

  };

  return PostOfficeService;
};
