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
    await queryInterface.addConstraint('system_admin_data', {
      fields: ['user_id'],
      type:'foreign key',
      name:'fk_system_admin_data_user_id',
      references:{
        table:'users',
        field:'user_id'
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
    await queryInterface.removeConstraint('system_admin_data','fk_system_admin_data_user_id');

  }
};
