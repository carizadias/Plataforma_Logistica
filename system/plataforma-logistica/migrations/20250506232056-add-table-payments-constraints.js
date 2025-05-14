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
    await queryInterface.addConstraint('payments', {
      fields: ['payment_method_id'],
      type:'foreign key',
      name:'fk_payments_payment_method_id',
      references:{
        table:'payment_methods',
        field:'payment_method_id'
      },
      onUpdate:'CASCADE',
      onDelete:'RESTRICT'
    });

    await queryInterface.addConstraint('payments', {
      fields: ['payment_status_id'],
      type:'foreign key',
      name:'fk_payments_payment_status_id',
      references:{
        table:'payment_status',
        field:'payment_status_id'
      },
      onUpdate:'CASCADE',
      onDelete:'RESTRICT'
    });

    await queryInterface.addConstraint('payments', {
      fields: ['currency_id'],
      type:'foreign key',
      name:'fk_payments_currency_id',
      references:{
        table:'currencies',
        field:'currency_id'
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
    await queryInterface.removeConstraint('payments','fk_payments_payment_method_id');
    await queryInterface.removeConstraint('payments','fk_payments_payment_status_id');
    await queryInterface.removeConstraint('payments','fk_payments_currency_id');


  }
};
