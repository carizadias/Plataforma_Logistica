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
    await queryInterface.createTable('orders', {
      order_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'users',
        //   key: 'user_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      order_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'order_types',
        //   key: 'order_type_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      payment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'payments',
        //   key: 'payment_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      post_office_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'post_offices',
        //   key: 'post_office_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      order_status_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'order_status',
        //   key: 'order_status_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      delivery_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'delivery_types',
        //   key: 'delivery_type_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      height: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      width: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tracking_code: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },
      send_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.dropTable('orders');
  }
};
