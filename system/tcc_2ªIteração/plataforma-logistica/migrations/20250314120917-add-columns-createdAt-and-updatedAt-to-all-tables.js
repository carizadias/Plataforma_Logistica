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

    const tables = await queryInterface.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = :schema",
      {
        replacements: { schema: 'plataforma_logistica' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    console.log("Tabelas encontradas:", tables);

    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      
      const columns = await queryInterface.describeTable(tableName);
      
      if (!columns.createdAt) {
        await queryInterface.addColumn(tableName, 'createdAt', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
      }
      
      if (!columns.updatedAt) {
        await queryInterface.addColumn(tableName, 'updatedAt', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        });
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const tables = await queryInterface.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = :schema",
      {
        replacements: { schema: 'plataforma_logistica' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      const columns = await queryInterface.describeTable(tableName);
      
      if (columns.createdAt) {
        await queryInterface.removeColumn(tableName, 'createdAt');
      }
      
      if (columns.updatedAt) {
        await queryInterface.removeColumn(tableName, 'updatedAt');
      }
    }
  }
};
