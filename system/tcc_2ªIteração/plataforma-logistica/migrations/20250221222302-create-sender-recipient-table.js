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
    await queryInterface.createTable('sender_recipient', {
      sender_nif: {
        type: Sequelize.CHAR,
        allowNull: false,
        primaryKey: true,
      },
      recipient_nif: {
        type: Sequelize.CHAR,
        allowNull: false,
        primaryKey: true,
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

    await queryInterface.dropTable('sender_recipient');
  }
};
