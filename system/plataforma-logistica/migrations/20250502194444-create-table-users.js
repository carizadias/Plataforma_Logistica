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
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'users',
        //   key: 'user_id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
      },
      profile_picture_id: {
        type: Sequelize.UUID,
        allowNull: true,
        // references: {
        //   model: 'files',
        //   key: 'file_id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',//Exibir imagem padrão via lógica do backend ou frontend sempre que profile_picture_id for null
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      last_changed_password: {
        type: Sequelize.DATE,//aqui é necessário default value?
        allowNull: true,
      },
      password_is_temporary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false,//o postal company admin por ex precisa ser validado por system admin junto com postal company 
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
    await queryInterface.dropTable('users');
  }
};
