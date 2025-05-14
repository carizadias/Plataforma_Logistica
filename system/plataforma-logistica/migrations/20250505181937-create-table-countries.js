'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('countries', {
      country_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      country_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'country_types',
        //   key: 'country_type_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      continent_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'continents',
        //   key: 'continents_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      currency_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'currencies',
        //   key: 'currency_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      code_alpha2: {
        type: Sequelize.STRING(2), // Ex: 'BR'
        allowNull: false,
        unique: true
      },
      code_alpha3: {
        type: Sequelize.STRING(3), // Ex: 'BRA'
        allowNull: false,
        unique: true
      },
      phone_code: {
        type: Sequelize.STRING(10), // Ex: '+55'
        allowNull: false,
        unique: true
      },
      area: {
        type: Sequelize.DECIMAL(12, 2), // até ~trilhões com 2 casas decimais
        allowNull: true,
      },
      timezone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deleted_at:{
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('countries');
  }
};
