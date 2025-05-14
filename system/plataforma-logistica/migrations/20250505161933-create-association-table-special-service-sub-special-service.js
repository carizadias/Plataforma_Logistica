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
    await queryInterface.createTable('special_service_sub_special_service', {
      special_service_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: 'special_services',
        //   key: 'special_service_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      sub_special_service_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: 'sub_special_services',
        //   key: 'sub_special_service_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      created_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at:{
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
    await queryInterface.dropTable('special_service_sub_special_service');
  }
};
