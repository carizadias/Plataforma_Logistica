module.exports = (sequelize, DataTypes) => {
  const PostOfficeService = sequelize.define('PostOfficeService', {
    post_office_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'PostOffices',
        key: 'post_office_id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Services',
        key: 'service_id'
      }
    }
  },{
    tableName: 'post_office_service', // Nome da tabela
    timestamps: false 
  });

  return PostOfficeService;
};
