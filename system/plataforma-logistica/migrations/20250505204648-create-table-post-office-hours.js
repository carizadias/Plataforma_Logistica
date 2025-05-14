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
    await queryInterface.createTable('post_office_hours', {
      post_office_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: 'post_offices',
        //   key: 'post_office_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
          min: 1,
          max: 7
        }
      },
      opening_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      closing_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
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
    await queryInterface.dropTable('post_office_hours');
  }
};
