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
    await queryInterface.addConstraint('special_service_sub_special_service', {
      fields: ['special_service_id'],
      type:'foreign key',
      name:'fk_special_service_sub_special_service_special_service_id',
      references:{
        table:'special_services',
        field:'special_service_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

    await queryInterface.addConstraint('special_service_sub_special_service', {
      fields: ['sub_special_service_id'],
      type:'foreign key',
      name:'fk_special_service_sub_special_service_sub_special_service_id',
      references:{
        table:'sub_special_services',
        field:'sub_special_service_id'
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
    await queryInterface.removeConstraint('special_service_sub_special_service','fk_special_service_sub_special_service_special_service_id');
    await queryInterface.removeConstraint('special_service_sub_special_service','fk_special_service_sub_special_service_sub_special_service_id');
  }
};
