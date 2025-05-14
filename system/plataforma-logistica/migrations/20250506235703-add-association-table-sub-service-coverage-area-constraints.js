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
    await queryInterface.addConstraint('sub_service_coverage_area', {
      fields: ['sub_service_id'],
      type:'foreign key',
      name:'fk_sub_service_coverage_area_sub_service_id',
      references:{
        table:'sub_services',
        field:'sub_service_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

    await queryInterface.addConstraint('sub_service_coverage_area', {
      fields: ['coverage_area_id'],
      type:'foreign key',
      name:'fk_sub_service_coverage_area_coverage_area_id',
      references:{
        table:'coverage_areas',
        field:'coverage_area_id'
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
    await queryInterface.removeConstraint('sub_service_coverage_area','fk_sub_service_coverage_area_sub_service_id');
    await queryInterface.removeConstraint('sub_service_coverage_area','fk_sub_service_coverage_area_coverage_area_id');


  }
};
