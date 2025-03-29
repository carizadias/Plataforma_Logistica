module.exports = (sequelize, DataTypes) => {
    const UserRoles = sequelize.define("UserRoles", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id",
            },
            primaryKey: true,
        },
        user_type: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "user_type",
                key: "name",
            },
            primaryKey: true,
        },
    }, {
        tableName: "user_roles",
        timestamps: false,
    });

    return UserRoles;
};
