'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE post_office_users 
      DROP PRIMARY KEY,
      CHANGE COLUMN id post_office_user_id INT NOT NULL AUTO_INCREMENT,
      ADD PRIMARY KEY (post_office_user_id)
    `);

    await queryInterface.removeConstraint('post_office_user_roles', 'post_office_user_roles_ibfk_1');

    await queryInterface.addConstraint('post_office_user_roles', {
      fields: ['post_office_user_id'],
      type: 'foreign key',
      name: 'post_office_user_roles_ibfk_1',
      references: {
        table: 'post_office_users',
        field: 'post_office_user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('post_office_user_roles', 'post_office_user_roles_ibfk_1');

    await queryInterface.sequelize.query(`
      ALTER TABLE post_office_users 
      DROP PRIMARY KEY,
      CHANGE COLUMN post_office_user_id id INT NOT NULL AUTO_INCREMENT,
      ADD PRIMARY KEY (id)
    `);

    await queryInterface.addConstraint('post_office_user_roles', {
      fields: ['post_office_user_id'],
      type: 'foreign key',
      name: 'post_office_user_roles_ibfk_1',
      references: {
        table: 'post_office_users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
