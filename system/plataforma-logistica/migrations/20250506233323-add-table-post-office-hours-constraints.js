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
    await queryInterface.addConstraint('post_office_hours', {
      fields: ['post_office_id'],
      type:'foreign key',
      name:'fk_post_office_hours_post_office_id',
      references:{
        table:'post_offices',
        field:'post_office_id'
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
    await queryInterface.removeConstraint('post_office_hours','fk_post_office_hours_post_office_id');


  }
};
