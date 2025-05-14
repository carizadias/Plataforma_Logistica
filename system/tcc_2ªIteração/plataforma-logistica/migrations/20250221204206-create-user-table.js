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
    await queryInterface.createTable('user', {
      user_nif: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone_number_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'phone_number',
          key: 'phone_number_id',
        },
      },
      bi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'gender',
          key: 'gender_id',
        },
      },
      profile_picture: {
        type: Sequelize.STRING,
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'address',
          key: 'address_id',
        },
      },
      type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user_type',
          key: 'type_id',
        },
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable('user');
  }
};
