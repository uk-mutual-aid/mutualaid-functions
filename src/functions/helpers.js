const axios = require('axios')


function parseSignUpToVolunteer(input, signUpId) {
  const result = {
    availability: input.availability,
    email: input.email,
    name: input.name,
    owns_car: input.owns_car,
    postcode: input.postcode,
    roles: input.roles,
    services_offered: input.services_offered,
    spoken_languages: input.spoken_languages,
    group_links: {
      whatsapp: input.whatsapp,
      facebook: input.facebook,
      telegram: input.telegram,
      discord: input.discord,
    },
    signup_id: signUpId
  }
  return result
}



function convertVolunteerToGeoJson(doc){
 const result = {
    type: 'Feature',
    properties: {
      'Display': doc.name,
      'Do you have a car?': doc.owns_car,
      'Services offered': doc.services_offered,
      'WhatsApp': doc.group_links.whatsapp,
      'Facebook': doc.group_links.facebook,
      'Spoken languages': doc.spoken_languages,
      'Availability': doc.availability
    },
    geometry:{
        type: 'Point',
        coordinates: [
          "geoCode.data[0].geometry.location.lng",
          "geoCode.data[0].geometry.location.lat"
        ]
    }
  }

  return result
}

module.exports = {
  parseSignUpToVolunteer,
  convertVolunteerToGeoJson
}