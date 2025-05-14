'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('postal_company_admin_data', {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: 'users',
        //   key: 'user_id',
        // },
        //onUpdate: 'CASCADE',
        //onDelete: 'CASCADE',
      },
      postal_company_id: {
        type: Sequelize.UUID,  // Definir conforme tipo de postal_company_id
        allowNull: false,
        // references: {
        //   model: 'postal_companies',  // Tabela postal_companies
        //   key: 'postal_company_id',  // Chave primária de postal_companies
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT',
      },
      is_rejected: {//apenas postal company e seu admin podem ser rejeitados
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('postal_company_admin_data');
  }
};
