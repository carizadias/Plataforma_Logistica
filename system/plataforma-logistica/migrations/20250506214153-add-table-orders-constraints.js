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
    await queryInterface.addConstraint('orders', {
      fields: ['sender_id'],
      type:'foreign key',
      name:'fk_orders_sender_id',
      references:{
        table:'users',
        field:'user_id'
      },
      onUpdate:'CASCADE',
      onDelete:'RESTRICT'
    });

    await queryInterface.addConstraint('orders', {
      fields: ['order_type_id'],
      type:'foreign key',
      name:'fk_orders_order_type_id',
      references:{
        table:'order_types',
        field:'order_type_id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
    });

    await queryInterface.addConstraint('orders', {
      fields: ['payment_id'],
      type:'foreign key',
      name:'fk_orders_payment_id',
      references:{
        table:'payments',
        field:'payment_id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
    });

    await queryInterface.addConstraint('orders', {
      fields: ['post_office_id'],
      type:'foreign key',
      name:'fk_orders_post_office_id',
      references:{
        table:'post_offices',
        field:'post_office_id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
    });

    await queryInterface.addConstraint('orders', {
      fields: ['order_status_id'],
      type:'foreign key',
      name:'fk_orders_order_status_id',
      references:{
        table:'order_status',
        field:'order_status_id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
    });

    await queryInterface.addConstraint('orders', {
      fields: ['delivery_type_id'],
      type:'foreign key',
      name:'fk_orders_delivery_type_id',
      references:{
        table:'delivery_types',
        field:'delivery_type_id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('orders','fk_orders_sender_id');
    await queryInterface.removeConstraint('orders','fk_orders_order_type_id');
    await queryInterface.removeConstraint('orders','fk_orders_payment_id');
    await queryInterface.removeConstraint('orders','fk_orders_post_office_id');
    await queryInterface.removeConstraint('orders','fk_orders_order_status_id');
    await queryInterface.removeConstraint('orders','fk_orders_delivery_type_id');

  }
};
