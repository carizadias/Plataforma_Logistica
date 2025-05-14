'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const tables = await queryInterface.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = :schema",
      {
        replacements: { schema: process.env.DB_NAME },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    for (const table of tables) {
      const tableName = table.table_name;
      
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
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     const tables = await queryInterface.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = :schema",
      {
        replacements: { schema: process.env.DB_NAME },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    
    for (const table of tables) {
      const tableName = table.table_name;
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
