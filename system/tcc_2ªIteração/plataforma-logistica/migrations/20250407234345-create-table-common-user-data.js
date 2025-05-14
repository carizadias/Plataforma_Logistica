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
    await queryInterface.createTable('common_user_data', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Definindo user_id como chave primária
        references: {
          model: 'users', // Nome da tabela users
          key: 'user_id', // Referência ao campo user_id da tabela users
        },
        onDelete: 'CASCADE', // Apaga o dado do usuário se o usuário for excluído
        allowNull: false,
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses', // Nome da tabela address
          key: 'address_id', // Referência ao campo address_id da tabela address
        },
        onDelete: 'SET NULL', // Se o endereço for excluído, o campo é definido como NULL
        allowNull: true, // O campo pode ser nulo
      },
      phone_number_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'phone_numbers', // Nome da tabela phone_numbers
          key: 'phone_number_id', // Referência ao campo phone_number_id da tabela phone_numbers
        },
        onDelete: 'SET NULL', // Se o telefone for excluído, o campo é definido como NULL
        allowNull: true, // O campo pode ser nulo
      },
      nif: {
        type: Sequelize.STRING(20),
        allowNull: true, // O campo pode ser nulo
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
    await queryInterface.dropTable('common_user_data');
  }
};
