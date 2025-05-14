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
    await queryInterface.addConstraint('phone_numbers', {
      fields: ['country_id'],
      type:'foreign key',
      name:'fk_phone_numbers_country_id',
      references:{
        table:'countries',
        field:'country_id'
      },
      onUpdate:'CASCADE',
      onDelete:'RESTRICT'
    });

    await queryInterface.addConstraint('phone_numbers', {
      fields: ['user_id'],
      type:'foreign key',
      name:'fk_phone_numbers_user_id',
      references:{
        table:'users',
        field:'user_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

    await queryInterface.addConstraint('phone_numbers', {
      fields: ['postal_company_id'],
      type:'foreign key',
      name:'fk_phone_numbers_postal_company_id',
      references:{
        table:'postal_companies',
        field:'postal_company_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

    await queryInterface.addConstraint('phone_numbers', {
      fields: ['post_office_id'],
      type:'foreign key',
      name:'fk_phone_numbers_post_office_id',
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
    await queryInterface.removeConstraint('phone_numbers','fk_phone_numbers_country_id');
    await queryInterface.removeConstraint('phone_numbers','fk_phone_numbers_user_id');
    await queryInterface.removeConstraint('phone_numbers','fk_phone_numbers_postal_company_id');
    await queryInterface.removeConstraint('phone_numbers','fk_phone_numbers_post_office_id');


  }
};
