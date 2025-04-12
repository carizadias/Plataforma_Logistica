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
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sender_nif: {
        type: Sequelize.CHAR,
        allowNull: false
      },
      order_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'order_types',
          key: 'order_type_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      height: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      width: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      weight: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payments',
          key: 'payment_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      send_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      post_office_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'post_offices', // Confirma este nome se for diferente
          key: 'post_office_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tracking_code: {
        type: Sequelize.CHAR,
        allowNull: true
      },
      delivery_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'delivery_types',
          key: 'delivery_type_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      current_status: {
        type: Sequelize.CHAR,
        allowNull: false
      },
      order_status_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'order_status', // Confirma este nome se estiver diferente
          key: 'order_status_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
