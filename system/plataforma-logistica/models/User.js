module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull:true,
      references: {
        model: 'users',
        key: 'user_id',
      },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    profile_picture_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'files',
        key: 'file_id'
      },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate:{
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },
    last_changed_password: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password_is_temporary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    paranoid: true,
    indexes: [
      {
        fields: ['name','surname'],//utilizar composta?
        name: 'users_name_surname_idx',
      }
    ],
  });

  User.associate = (models) => {

    User.hasMany(models.Order, {foreignKey: 'sender_id',as: 'sentOrders'});
    User.hasMany(models.PhoneNumber, {foreignKey: 'user_id',as: 'phoneNumbers'});

    User.belongsTo(models.File, { foreignKey: 'profile_picture_id', as: 'profilePicture'});
    User.belongsTo(models.User, {foreignKey: 'created_by',as: 'creator'});

    User.hasOne(models.ClientUserData, {foreignKey: 'user_id', as: 'clientUserData'});
    User.hasOne(models.SystemAdminData, {foreignKey: 'user_id', as: 'systemAdminData'});
    User.hasOne(models.PostalCompanyAdminData, {foreignKey: 'user_id', as: 'postalCompanyAdminData'});
    User.hasOne(models.PostalCompanyEmployeeData, {foreignKey: 'user_id', as: 'postalCompanyEmployeeData'});
    
    User.belongsToMany(models.UserType,{
      through:'user_role',
      foreignKey:'user_id',
      otherKey: 'user_type',
      as:'roles'
    });

    User.belongsToMany(models.Order,{
      through:'order_recipient',
      foreignKey:'recipient_id',
      otherKey: 'order_id',
      as:'receivedOrders'
    });

    User.belongsToMany(models.Address, {
      through: 'user_address',
      foreignKey: 'user_id',
      otherKey: 'address_id',
      as: 'addresses'
    });
  };
  return User;
}