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



function convertToGeoJson(doc){
  

 var vol = {
    properties: {
      'Display': doc.data().name,
      'Do you have a car?': doc.data().owns_car,
      'Services offered': doc.data().services_offered,
      // 'WhatsApp': doc.data().group_links.whatsapp,
      // 'Facebook': doc.data().group_links.facebook,
      'Spoken languages': doc.data().spoken_languages,
      'Availability': doc.data().availability
    },
    geometry:{
        'type': 'Point',
        coordinates:{
          0: "geoCode.data[0].geometry.location.lng",
          1: "geoCode.data[0].geometry.location.lat"
        }
    }
  }

  return vol;

}

module.exports = {
  parseSignUpToVolunteer,
  convertToGeoJson
}