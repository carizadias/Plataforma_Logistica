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
    await queryInterface.createTable('fees', {
      fee_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'order_types',
          key: 'order_type_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      sub_service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sub_services',
          key: 'sub_service_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      weight_min: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      weight_max: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      price_national: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      price_international: {
        type: Sequelize.DECIMAL,
        allowNull: false
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
    await queryInterface.dropTable('fees');
  }
};
