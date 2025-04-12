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
    await queryInterface.createTable('agency_addresses', {
      agency_addresses_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      agency_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'agencies', // Assume que se tem uma tabela 'agencies'
          key: 'agency_id'
        }
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'address_id'
        }
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
    await queryInterface.dropTable('agency_addresses');
  }
};
