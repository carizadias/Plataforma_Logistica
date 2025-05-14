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
    await queryInterface.createTable('user_role', {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: 'users',
        //   key: 'user_id',
        // },
        // onUpdate:'CASCADE'
        // onDelete: 'CASCADE',
      },
      user_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: 'user_types',
        //   key: 'name',
        // },
        //onUpdate:'CASCADE',
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
    await queryInterface.dropTable('user_role');
  }
};
