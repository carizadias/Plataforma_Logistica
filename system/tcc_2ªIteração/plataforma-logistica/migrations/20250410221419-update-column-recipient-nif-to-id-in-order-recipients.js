'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remover a tabela 'order_recipient' se ela existir
    await queryInterface.dropTable('order_recipient');

    // Criar a nova tabela 'order_recipient'
    await queryInterface.createTable('order_recipient', {
      order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,  // Chave primária para order_id
        allowNull: false
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,  // Chave primária para recipient_id (combinada com order_id)
        allowNull: false,
        references: {
          model: 'users',  // A tabela de usuários
          key: 'user_id'  // A chave primária dos usuários
        },
        onUpdate: 'CASCADE',  // Atualiza os registros quando o user_id for alterado
        onDelete: 'CASCADE'   // Deleta os registros da order_recipient quando o usuário for deletado
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverter a criação da tabela 'order_recipient' e deletá-la
    await queryInterface.dropTable('order_recipient');
  }
};
