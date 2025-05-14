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
    await queryInterface.addConstraint('order_evaluation', {
      fields: ['order_id'],
      type:'foreign key',
      name:'fk_order_evaluation_order_id',
      references:{
        table:'orders',
        field:'order_id'
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
    await queryInterface.removeConstraint('order_evaluation','fk_order_evaluation_order_id');


  }
};
