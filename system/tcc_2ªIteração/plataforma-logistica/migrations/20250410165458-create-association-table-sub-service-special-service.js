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
    await queryInterface.createTable('sub_service_special_service', {
      sub_service_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'sub_services', // Nome da tabela SubServices
          key: 'sub_service_id' // Referência à chave primária
        }
      },
      special_service_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'special_services', // Nome da tabela SpecialServices
          key: 'special_service_id' // Referência à chave primária
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
    await queryInterface.dropTable('sub_service_special_service');
  }
};
