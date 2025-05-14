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
    await queryInterface.addConstraint('postal_company_admin_data', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_postal_company_admin_data_user_id',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // 🔗 FK: user_type_id -> user_types.name
    await queryInterface.addConstraint('postal_company_admin_data', {
      fields: ['postal_company_id'],
      type: 'foreign key',
      name: 'fk_postal_company_admin_data_postal_company_id',
      references: {
        table: 'postal_companies',
        field: 'postal_company_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('postal_company_admin_data', 'fk_postal_company_admin_data_user_id');
    await queryInterface.removeConstraint('postal_company_admin_data', 'fk_postal_company_admin_data_postal_company_id');
  }
};
