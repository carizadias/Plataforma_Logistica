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
    await queryInterface.addConstraint('user_type_permission', {
      fields: ['user_type'],
      type:'foreign key',
      name:'fk_user_type_permission_user_type',
      references:{
        table:'user_types',
        field:'name'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

    await queryInterface.addConstraint('user_type_permission', {
      fields: ['permission'],
      type:'foreign key',
      name:'fk_user_type_permission_permission',
      references:{
        table:'permissions',
        field:'name'
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
    await queryInterface.removeConstraint('user_type_permission','fk_user_type_permission_user_type');
    await queryInterface.removeConstraint('user_type_permission','fk_user_type_permission_permission');

  }
};
