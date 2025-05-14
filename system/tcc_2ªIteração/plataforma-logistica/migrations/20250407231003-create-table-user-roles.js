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
    await queryInterface.createTable('user_roles', {
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Nome da tabela users
          key: 'user_id', // Referência ao campo user_id da tabela users
        },
        onDelete: 'CASCADE', // Apaga o role se o usuário for excluído
        allowNull: false,
        primaryKey: true,
      },
      user_type: {
        type: Sequelize.STRING(50),
        references: {
          model: 'user_types', // Nome da tabela user_types
          key: 'name', // Referência ao campo name da tabela user_types
        },
        onDelete: 'CASCADE', // Apaga o role se o tipo de usuário for excluído
        allowNull: false,
        primaryKey: true,
      },
      // Chave primária composta pelas duas colunas
      //primaryKey: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('user_roles');
  }
};
