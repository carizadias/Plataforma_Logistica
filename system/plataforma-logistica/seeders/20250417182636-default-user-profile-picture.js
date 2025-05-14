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
    await queryInterface.bulkInsert('files', [{
      name: 'defaultUserProfilePicture.png',
      url: 'uploads/profile_pictures/default_profile_picture/defaultUserProfilePicture.png',
      type: 'image/png',
      size: 0, // você pode colocar o tamanho real do arquivo em bytes, se souber
      uploaded_by: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('files', {
      name: 'defaultUserProfilePicture.png',
      url: 'uploads/profile_pictures/default_profile_picture/defaultUserProfilePicture.png'
    }, {});
  }
};
