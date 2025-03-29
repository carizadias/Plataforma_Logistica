'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint(
        'post_office_user_roles',
        'post_office_user_roles_ibfk_2'
      );
      console.log('Constraint post_office_user_roles_ibfk_2 removida com sucesso.');
    } catch (err) {
      console.warn('Constraint post_office_user_roles_ibfk_2 não encontrada. Prosseguindo com a migração.');
    }

    await queryInterface.renameColumn('post_office_user_type', 'type_id', 'post_office_user_type_id');

    await queryInterface.addConstraint('post_office_user_roles', {
      fields: ['post_office_user_type_id'],
      type: 'foreign key',
      name: 'fk_post_office_user_roles_post_office_user_type_id',
      references: {
        table: 'post_office_user_type',
        field: 'post_office_user_type_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint(
        'post_office_user_roles',
        'fk_post_office_user_roles_post_office_user_type_id'
      );
      console.log('Constraint fk_post_office_user_roles_post_office_user_type_id removida com sucesso.');
    } catch (err) {
      console.warn('Constraint fk_post_office_user_roles_post_office_user_type_id não encontrada. Prosseguindo.');
    }

    await queryInterface.renameColumn('post_office_user_type', 'post_office_user_type_id', 'type_id');

    await queryInterface.addConstraint('post_office_user_roles', {
      fields: ['type_id'],
      type: 'foreign key',
      name: 'post_office_user_roles_ibfk_2',
      references: {
        table: 'post_office_user_type',
        field: 'type_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
