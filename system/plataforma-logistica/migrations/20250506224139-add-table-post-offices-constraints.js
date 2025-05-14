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
    await queryInterface.addConstraint('post_offices', {
      fields: ['postal_company_id'],
      type:'foreign key',
      name:'fk_post_offices_postal_company_id',
      references:{
        table:'postal_companies',
        field:'postal_company_id'
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });

    await queryInterface.addConstraint('post_offices', {
      fields: ['address_id'],
      type:'foreign key',
      name:'fk_post_offices_address_id',
      references:{
        table:'addresses',
        field:'address_id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
    });

    await queryInterface.addConstraint('post_offices', {
      fields: ['photo_id'],
      type:'foreign key',
      name:'fk_post_offices_photo_id',
      references:{
        table:'files',
        field:'file_id'
      },
      onUpdate:'CASCADE',
      onDelete:'SET NULL'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('post_offices','fk_post_offices_postal_company_id');
    await queryInterface.removeConstraint('post_offices','fk_post_offices_address_id');
    await queryInterface.removeConstraint('post_offices','fk_post_offices_photo_id');

  }
};
