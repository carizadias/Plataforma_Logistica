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
    await queryInterface.addConstraint('fees', {
      fields: ['order_type_id'],
      type:'foreign key',
      name:'fk_fees_order_type_id',
      references:{
        table:'order_types',
        field:'order_type_id'
      },
      onUpdate:'CASCADE',
      onDelete:'RESTRICT'
    });

    await queryInterface.addConstraint('fees', {
      fields: ['sub_service_id'],
      type:'foreign key',
      name:'fk_fees_sub_service_id',
      references:{
        table:'sub_services',
        field:'sub_service_id'
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
    await queryInterface.removeConstraint('fees','fk_fees_order_type_id');
    await queryInterface.removeConstraint('fees','fk_fees_sub_service_id');


  }
};
