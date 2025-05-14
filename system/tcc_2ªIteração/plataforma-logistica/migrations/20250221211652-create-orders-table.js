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
    await queryInterface.createTable('order', {
      order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sender_nif: {
        type: Sequelize.CHAR,
        allowNull: false,
      },
      order_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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
        allowNull: false
      },
      send_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      post_office_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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
        allowNull: true
      },
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.CHAR,
        allowNull: false
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('order');
  }
};
