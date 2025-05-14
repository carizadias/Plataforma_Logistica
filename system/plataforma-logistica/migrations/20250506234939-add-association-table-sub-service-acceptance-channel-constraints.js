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
    await queryInterface.addConstraint('sub_service_acceptance_channel', {
      fields: ['sub_service_id'],
      type:'foreign key',
      name:'fk_sub_service_acceptance_channel_sub_service_id',
      references:{
        table:'sub_services',
        field:'sub_service_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

    await queryInterface.addConstraint('sub_service_acceptance_channel', {
      fields: ['acceptance_channel_id'],
      type:'foreign key',
      name:'fk_sub_service_acceptance_channel_acceptance_channel_id',
      references:{
        table:'acceptance_channels',
        field:'acceptance_channel_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('sub_service_acceptance_channel','fk_sub_service_acceptance_channel_sub_service_id');
    await queryInterface.removeConstraint('sub_service_acceptance_channel','fk_sub_service_acceptance_channel_acceptance_channel_id');


  }
};
