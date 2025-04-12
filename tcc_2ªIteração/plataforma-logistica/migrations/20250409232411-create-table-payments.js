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
    await queryInterface.createTable('payments', {
      payment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      payment_method_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payment_methods', // nome da tabela referenciada
          key: 'payment_method_id', // chave primária da tabela referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payment_status', // nome da tabela referenciada
          key: 'payment_status_id', // chave primária da tabela referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('payments');
  }
};
