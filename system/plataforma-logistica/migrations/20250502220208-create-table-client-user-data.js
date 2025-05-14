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
    await queryInterface.createTable('client_user_data', {
      user_id: {
        type: Sequelize.UUID,  // Consistência com o tipo UUID se users usar UUID
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: 'users',  // Referência para a tabela users
        //   key: 'user_id',  // Chave primária da tabela users
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
      nif: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      reset_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reset_token_expire: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
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
    await queryInterface.dropTable('client_user_data');
  }
};
