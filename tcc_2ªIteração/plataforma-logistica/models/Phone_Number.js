module.exports = (sequelize, DataTypes) => {
  const PhoneNumber = sequelize.define('PhoneNumber', {
    phone_number_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // user_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'users',
    //     key: 'user_id'
    //   }
    // },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'phone_numbers',
    timestamps: false,
  });

  // PhoneNumber.associate = function(models) {
  //   PhoneNumber.belongsTo(models.User, { 
  //     foreignKey: 'user_id', 
  //     as: 'user'
  //   });
  // };
  PhoneNumber.associate = (models) => {
    PhoneNumber.hasMany(models.PhoneNumber, {
      foreignKey: 'phone_number_id',
      as:'owners'
    })
  }

  return PhoneNumber;
};
