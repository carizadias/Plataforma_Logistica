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
    await queryInterface.addConstraint('user_address', {
      fields: ['user_id'],
      type:'foreign key',
      name:'fk_user_address_user_id',
      references:{
        table:'users',
        field:'user_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

        await queryInterface.addConstraint('user_address', {
      fields: ['address_id'],
      type:'foreign key',
      name:'fk_user_address_address_id',
      references:{
        table:'addresses',
        field:'address_id'
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
    await queryInterface.removeConstraint('user_address','fk_user_address_user_id');
    await queryInterface.removeConstraint('user_address','fk_user_address_address_id');


  }
};
