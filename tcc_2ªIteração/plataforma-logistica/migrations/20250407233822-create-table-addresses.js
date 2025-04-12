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
    await queryInterface.createTable('addresses', {
      address_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Incrementa automaticamente o valor
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false, // O campo é obrigatório
      },
      door_number: {
        type: Sequelize.STRING,
        allowNull: true, // O campo pode ser nulo
      },
      floor_number: {
        type: Sequelize.STRING,
        allowNull: true, // O campo pode ser nulo
      },
      city_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'cities', // Nome da tabela cities
        //   key: 'city_id', // Referência ao campo city_id da tabela cities
        // },
        onDelete: 'SET NULL', // Se a cidade for excluída, o campo city_id será setado como NULL
        allowNull: false, // O campo é obrigatório
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // O campo é obrigatório
      },
      owner_type: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('addresses');
  }
};
