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
    await queryInterface.addColumn('common_user_data', 'resetToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('common_user_data', 'resetTokenExpire', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('common_user_data', 'resetToken');
    await queryInterface.removeColumn('common_user_data', 'resetTokenExpire');
  }
};
