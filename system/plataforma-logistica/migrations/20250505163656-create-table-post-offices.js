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
    await queryInterface.createTable('post_offices', {
      post_office_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      postal_company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'postal_companies',
        //   key: 'postal_company_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      address_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'addresses',
        //   key: 'address_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      photo_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'file',
        //   key: 'file_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deleted_at:{
        type: Sequelize.DATE
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
    await queryInterface.dropTable('post_offices');
  }
};
