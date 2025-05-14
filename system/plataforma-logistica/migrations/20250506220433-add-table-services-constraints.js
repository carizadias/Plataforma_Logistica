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
    await queryInterface.addConstraint('services', {
      fields: ['postal_company_id'],
      type:'foreign key',
      name:'fk_services_postal_company_id',
      references:{
        table:'postal_companies',
        field:'postal_company_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('services','fk_services_postal_company_id');
  }
};
