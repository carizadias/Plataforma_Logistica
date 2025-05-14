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

    // 🔗 FK: user_id -> users.user_id
    await queryInterface.addConstraint('user_roles', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_roles_user_id',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'//não é necessario apagar antes de terminar mvp final
    });

    // 🔗 FK: user_type_id -> user_types.name
    await queryInterface.addConstraint('user_roles', {
      fields: ['user_type_id'],
      type: 'foreign key',
      name: 'fk_user_roles_user_type_id',
      references: {
        table: 'user_types',
        field: 'name'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'//não é necessario apagar antes de terminar mvp final
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('user_roles', 'fk_user_roles_user_id');
    await queryInterface.removeConstraint('user_roles', 'fk_user_roles_user_type_id');
  }
};
