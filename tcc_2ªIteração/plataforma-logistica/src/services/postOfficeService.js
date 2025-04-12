const { PostOffice, Country, ProfilePicture, PhoneNumber, Agency } = require('../../models');

exports.getPostOfficeProfile = async (id) => {
  const postOffice = await PostOffice.findOne({
    where: { post_office_id: id },
    attributes: ['post_office_id', 'name', 'nif', 'is_active', 'rejected'],
    include: [
      {
        model: Country,
        as: 'country',
        attributes: ['country_id', 'name']
      },
      {
        model: ProfilePicture,
        as: 'profile_picture_info',
        attributes: ['profile_picture_id'] 
      },
      {
        model: PhoneNumber,
        as: 'phone',
        attributes: ['phone_number_id', 'phone_number']
      },
      {
        model: Agency,
        as: 'agencies',
        attributes: ['agency_id', 'name']
      }
    ]
  });

  return postOffice;
};
