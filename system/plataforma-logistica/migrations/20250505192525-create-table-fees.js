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
    await queryInterface.createTable('fees', {
      fee_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      order_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'order_types',
        //   key: 'order_type_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      sub_service_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'sub_services',
        //   key: 'sub_service_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      weight_min: {
        type: Sequelize.DECIMAL(10, 2), // até 99999999.99
        allowNull: false
      },
      weight_max: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },      
      price_national: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      price_international: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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
    await queryInterface.dropTable('fees');
  }
};
