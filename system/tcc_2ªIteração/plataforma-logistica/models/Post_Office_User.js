module.exports = (sequelize, DataTypes) => {
    const PostOfficeUser = sequelize.define('PostOfficeUser', {
        post_office_user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_office_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    }, {
        tableName: 'post_office_users',

    });

    PostOfficeUser.associate = (models) => {
        PostOfficeUser.belongsToMany(models.PostOfficeUserType, {
            through: models.PostOfficeUserRoles,
            foreignKey: "post_office_user_id",
            otherKey: "post_office_user_type_id",
            as: "roles",
    });
  };

    return PostOfficeUser;
};
