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
    await queryInterface.addConstraint('addresses', {
      fields: ['neighborhood_id'],
      type:'foreign key',
      name:'fk_addresses_neighborhood_id',
      references:{
        table:'neighborhoods',
        field:'neighborhood_id'
      },
      onUpdate:'CASCADE',
      onDelete:'RESTRICT'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('addresses','fk_addresses_neighborhood_id');

  }
};
