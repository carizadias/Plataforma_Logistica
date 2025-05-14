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
    await queryInterface.createTable('phone_numbers', {
      phone_number_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Incrementa automaticamente o valor
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Nome da tabela users
          key: 'user_id', // Referência ao campo user_id da tabela users
        },
        onDelete: 'CASCADE', // Apaga o telefone se o usuário for excluído
        allowNull: false, // O campo é obrigatório
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false, // O campo é obrigatório
      },
      phone_number_code: {
        type: Sequelize.INTEGER,
        allowNull: false, // O campo é obrigatório
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
    await queryInterface.dropTable('phone_numbers');
  }
};
