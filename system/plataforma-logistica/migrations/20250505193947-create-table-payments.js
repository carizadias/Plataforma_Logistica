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
    await queryInterface.createTable('payments', {
      payment_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      payment_method_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'payment_methods',
        //   key: 'payment_method_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      payment_status_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'payment_status',
        //   key: 'payment_status_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      currency_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'currencies',
        //   key: 'currency_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      //desativar pagamento..?
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
    await queryInterface.dropTable('payments');
  }
};
