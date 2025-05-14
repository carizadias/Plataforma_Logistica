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
    await queryInterface.createTable('postal_companies', {
      postal_company_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'country_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      nif: {
        type: Sequelize.STRING(20),
        unique: true
      },
      logotype_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'files',
          key: 'file_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      rejected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('postal_companies');
  }
};
