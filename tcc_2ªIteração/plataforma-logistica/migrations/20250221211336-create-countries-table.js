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
    await queryInterface.createTable('countries', {
      country_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      code: {
          type: Sequelize.STRING,
          allowNull: false
      },
      continent_id: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      area: {
          type: Sequelize.STRING,
          allowNull: true
      },
      currency_id: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      timezone: {
          type: Sequelize.STRING,
          allowNull: true
      },
      is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
      },
      phone_number_code: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
      },
      type: {
          type: Sequelize.STRING,
          allowNull: true
      }
  });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('countries');
  }
};
