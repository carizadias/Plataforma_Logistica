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
    await queryInterface.createTable('recipients', {
      user_nif: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'addresses', // Confirma o nome da tabela associada
          key: 'address_id',          // Confirma o nome da chave primária
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      phone_number_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'phone_numbers', // Confirma o nome da tabela associada
          key: 'phone_number_id',              // Confirma o nome da chave primária
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('recipients');
  }
};
