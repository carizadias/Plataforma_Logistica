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
    await queryInterface.createTable('service_subservice', {
      service_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      subservice_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('service_subservice');
  }
};
