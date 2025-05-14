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
    await queryInterface.createTable('user_type_permission', {
      user_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true,
        // references:{
        //   model:'user_types',
        //   key:'name'
        // },
        //onUpdate: 'CASCADE'
        //onDelete: 'CASCADE',
      },
      permission: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true,
        // references:{
        //   model:'permissions',
        //   key:'name'
        // },
        //onUpdate: 'CASCADE'
        //onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('user_type_permission');
  }
};
