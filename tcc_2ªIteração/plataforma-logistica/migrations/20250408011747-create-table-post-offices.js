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
    await queryInterface.createTable('post_offices', {
      post_office_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'countries',         // Nome da tabela de países
        //   key: 'country_id',          // Chave primária na tabela de países
        // },
        onDelete: 'RESTRICT',         // Defina a ação desejada em exclusões (ajuste se necessário)
      },
      profile_picture: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'profile_pictures',  // Nome da tabela das fotos de perfil
          key: 'profile_picture_id',  // Chave primária na tabela das fotos de perfil
        },
        //onDelete: 'SET NULL',         // Se a foto for excluída, define o campo como NULL (ajuste se necessário)
      },
      nif: {
        type: Sequelize.STRING(20),
        allowNull: false,             // Se o NIF é obrigatório, não permite nulo
      },
      phone_number_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'phone_numbers',     // Nome da tabela dos números de telefone
          key: 'phone_number_id',     // Chave primária na tabela dos números de telefone
        },
        //onDelete: 'SET NULL',         // Se o número for excluído, define o campo como NULL (ajuste se necessário)
      },
      rejected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable('post_offices');
  }
};
