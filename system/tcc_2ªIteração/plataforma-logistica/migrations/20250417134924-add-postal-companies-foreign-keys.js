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
    await queryInterface.addConstraint('postal_companies', {
      fields: ['logotype_id'],
      type: 'foreign key',
      name: 'fk_postal_companies_logotype_id',
      references: {
        table: 'files',
        field: 'file_id'
      },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('postal_companies', 'fk_postal_companies_logotype_id');
  }
};
