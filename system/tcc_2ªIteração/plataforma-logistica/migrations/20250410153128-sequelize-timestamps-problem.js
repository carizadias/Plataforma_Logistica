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
    const columns = await queryInterface.describeTable('post_office_service');
    
    if (columns.createdAt) {
      await queryInterface.removeColumn('post_office_service', 'createdAt');
    }

    if (columns.updatedAt) {
      await queryInterface.removeColumn('post_office_service', 'updatedAt');
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('post_office_service', 'createdAt', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('post_office_service', 'updatedAt', {
      type: Sequelize.DATE,
    });
  }
};
