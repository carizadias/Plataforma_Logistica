module.exports = (sequelize, DataTypes) => {
  const PostOffice = sequelize.define('PostOffice', {
    post_office_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.INTEGER,
      references:{
        model:'countries',
        key:'country_id'
      },
      allowNull: false,
    },

    profile_picture_id: {
      type: DataTypes.INTEGER,
      references:{
        model:'profile_pictures',
        key:'profile_picture_id'
      },
      allowNull: false,
    },
    nif: {
      type: DataTypes.STRING(20),
      allowNull: false, // O campo pode ser nulo
    },
    phone_number_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'phone_numbers', // Nome da tabela phone_numbers
        key: 'phone_number_id', // Referência ao campo phone_number_id da tabela phone_numbers
      },
      allowNull: false, // O campo pode ser nulo
    },
    rejected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'post_offices',
    timestamps: false,
  });

  PostOffice.associate = (models) => {
    PostOffice.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
  
    PostOffice.hasMany(models.Agency, {
      foreignKey: 'post_office_id',
      as: 'agencies'
    });

    PostOffice.belongsTo(models.ProfilePicture, {
      foreignKey: 'profile_picture_id',
      as: 'profile_picture_info',
    });
    
    PostOffice.belongsTo(models.PhoneNumber, {
      foreignKey: 'phone_number_id',
      as: 'phone',
    });

    PostOffice.belongsToMany(models.Service, {
      through: 'post_office_service',
      foreignKey: 'post_office_id',
      otherKey: 'service_id',
      as: 'services',
      timestamps: false
    });
    
  };
  

  return PostOffice;
};
