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
    await queryInterface.createTable('user_address', {
      user_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        // references: {
        //   model: 'users',
        //   key: 'user_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      address_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        // references: {
        //   model: 'addresses',
        //   key: 'address_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
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
    await queryInterface.dropTable('user_address');
  }
};
