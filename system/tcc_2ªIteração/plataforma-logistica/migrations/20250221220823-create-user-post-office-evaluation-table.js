'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("user_post_office_evaluation", {
      user_nif: {
        type: Sequelize.CHAR,
        allowNull: false,
        primaryKey: true,
        onDelete: "CASCADE",
      },
      post_office_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: "CASCADE",
      },
      rating: {
        type: Sequelize.CHAR,
        allowNull: false,
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      evaluation_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("user_post_office_evaluation");
  }
};
