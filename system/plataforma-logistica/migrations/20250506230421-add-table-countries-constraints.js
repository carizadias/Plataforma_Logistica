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
    await queryInterface.addConstraint('countries', {
      fields: ['country_type_id'],
      type:'foreign key',
      name:'fk_countries_country_type_id',
      references:{
        table:'country_types',
        field:'country_type_id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
    });

    await queryInterface.addConstraint('countries', {
      fields: ['continent_id'],
      type:'foreign key',
      name:'fk_countries_continent_id',
      references:{
        table:'continents',
        field:'continent_id'
      },
      onUpdate:'CASCADE',
      onDelete:'RESTRICT'
    });

    await queryInterface.addConstraint('countries', {
      fields: ['currency_id'],
      type:'foreign key',
      name:'fk_countries_currency_id',
      references:{
        table:'currencies',
        field:'currency_id'
      },
      onUpdate:'CASCADE',
      onDelete:'RESTRICT'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('countries','fk_countries_country_type_id');
    await queryInterface.removeConstraint('countries','fk_countries_country_type_id');
    await queryInterface.removeConstraint('countries','fk_countries_currency_id');


  }
};
