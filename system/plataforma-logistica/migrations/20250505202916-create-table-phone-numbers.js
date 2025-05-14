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
    await queryInterface.createTable('phone_numbers', {
      phone_number_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      country_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'countries',
        //   key: 'country_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'users',
        //   key: 'user_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      postal_company_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'postal_companies',
        //   key: 'postal_company_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      post_office_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'post_offices',
        //   key: 'post_office_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      phone_number: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('phone_numbers');
  }
};
