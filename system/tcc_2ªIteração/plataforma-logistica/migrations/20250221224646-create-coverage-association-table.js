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
    await queryInterface.createTable('coverage_association', {
      coverage_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      association_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      association_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('coverage_association');
  }
};
