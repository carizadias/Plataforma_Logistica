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
    await queryInterface.createTable('addresses', {
      address_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      neighborhood_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'neighborhoods',
        //   key: 'neighborhood_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'RESTRICT'//não deixa apagar se tiver um address associado
      },
      street: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      door_number: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      floor_number: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('addresses');
  }
};
