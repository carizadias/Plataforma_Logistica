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
    await queryInterface.createTable('subservice_special_service', {
      subservice_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
      },
      spetial_service_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('subservice_special_service');
  }
};
