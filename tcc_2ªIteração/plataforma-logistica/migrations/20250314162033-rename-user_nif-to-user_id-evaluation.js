'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('user_post_office_evaluation', 'user_nif', 'user_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('user_post_office_evaluation', 'user_id', 'user_nif');
  }
};
