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
    await queryInterface.addConstraint('postal_company_employee_data', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_postal_company_employee_data_user_id',
      references: {
        table: 'users',
        field: 'user_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('postal_company_employee_data', {
      fields: ['postal_company_id'],
      type: 'foreign key',
      name: 'fk_postal_company_employee_data_postal_company_id',
      references: {
        table: 'postal_companies',
        field: 'postal_company_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('postal_company_employee_data', {
      fields: ['post_office_id'],
      type: 'foreign key',
      name: 'fk_postal_company_employee_data_post_office_id',
      references: {
        table: 'post_offices',
        field: 'post_office_id'
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
    await queryInterface.removeConstraint('postal_company_employee_data', 'fk_postal_company_employee_data_user_id');
    await queryInterface.removeConstraint('postal_company_employee_data', 'fk_postal_company_employee_data_postal_company_id');
    await queryInterface.removeConstraint('postal_company_employee_data', 'fk_postal_company_employee_data_post_office_id');


  }
};
