module.exports = (sequelize, DataTypes) => {
  const UserPostOfficeEvaluation = sequelize.define("UserPostOfficeEvaluation", {
    user_id: {
      type: DataTypes.CHAR,
      allowNull: false,
      primaryKey: true,

    },
    post_office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,

    },
    rating: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    evaluation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "user_post_office_evaluation",
    timestamps: false,
  });


  return UserPostOfficeEvaluation;
};
