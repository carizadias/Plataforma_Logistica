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
    await queryInterface.addConstraint('users', {
      fields: ['profile_picture_id'],
      type: 'foreign key',
      name: 'fk_users_profile_picture_id',
      references: {
        table: 'files',
        field: 'file_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    await queryInterface.addConstraint('users', {
      fields: ['created_by_user_id'],
      type: 'foreign key',
      name: 'fk_users_created_by_user_id',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('users', 'fk_users_profile_picture_id');
  await queryInterface.removeConstraint('users', 'fk_users_created_by_user_id');
  }
};
