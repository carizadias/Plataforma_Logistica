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
    await queryInterface.createTable('subservice_distribution_channel', {
      subservice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subservices',
          key: 'subservice_id',
        },
        primaryKey: true,
      },
      distribution_channel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'distribution_channels',
          key: 'distribution_channel_id',
        },
        primaryKey: true,
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
    await queryInterface.dropTable('subservice_distribution_channel');
  }
};
