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
    await queryInterface.createTable('service_sub_service', {
      service_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'services', // nome da tabela de serviços
          key: 'service_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sub_service_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'sub_services', // nome da tabela de subserviços
          key: 'sub_service_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('service_sub_service');
  }
};
