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
    await queryInterface.createTable('postal_company_employee_data', {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: 'users',  // Tabela de referência
        //   key: 'user_id',  // Chave primária da tabela 'users'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
      postal_company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'postal_companies',  // Tabela de referência
        //   key: 'postal_company_id',  // Chave primária da tabela 'postal_companies'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT',
      },
      post_office_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'post_offices',  // Tabela de referência
        //   key: 'post_office_id',  // Chave primária da tabela 'post_offices'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',//se apagar post office não apaga utilizador este apenas pode estar ligado a um post office mas é funcionario da postal company
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
    await queryInterface.dropTable('postal_company_employee_data');
  }
};
