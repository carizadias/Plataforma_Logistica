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
    await queryInterface.createTable('sub_service_special_service', {
      sub_service_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        // references: {
        //   model: 'sub_services',
        //   key: 'sub_service_id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      special_service_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        // references: {
        //   model: 'special_services',
        //   key: 'special_service_id',
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
    await queryInterface.dropTable('sub_service_special_service')
  }
};
