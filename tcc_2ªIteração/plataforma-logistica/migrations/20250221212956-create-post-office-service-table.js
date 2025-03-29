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
    await queryInterface.createTable('post_office_service', {
      post_office_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
      },
      service_id: {
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
    await queryInterface.dropTable('post_office_service');
  }
};
