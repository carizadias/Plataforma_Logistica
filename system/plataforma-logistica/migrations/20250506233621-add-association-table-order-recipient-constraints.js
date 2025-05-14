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
    await queryInterface.addConstraint('order_recipient', {
      fields: ['recipient_id'],
      type:'foreign key',
      name:'fk_order_recipient_recipient_id',
      references:{
        table:'users',
        field:'user_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

        await queryInterface.addConstraint('order_recipient', {
      fields: ['order_id'],
      type:'foreign key',
      name:'fk_order_recipient_order_id',
      references:{
        table:'orders',
        field:'order_id'
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
    await queryInterface.removeConstraint('order_recipient','fk_order_recipient_recipient_id');
    await queryInterface.removeConstraint('order_recipient','fk_order_recipient_order_id');


  }
};
