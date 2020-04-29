const axios = require('axios')
const { POSTCODE_LOOKUP_URL } = process.env

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

async function postcodeToCoordinates(postcode) {
  const lookupResult = (await axios.get(POSTCODE_LOOKUP_URL + postcode)).data.result
  const { latitude: lat, longitude: lng } = lookupResult
  return ({ lat, lng  })
}


async function convertVolunteerToGeoJson(doc){
  function trimNameToFirst(name) {
    return name.split(' ')[0]
  }
  if (doc.group_links === undefined ) doc.group_links = {}
  const coords = await postcodeToCoordinates(doc.postcode)
  const result = {
    type: 'Feature',
    properties: {
      'Display': trimNameToFirst(doc.name),
      'Do you have a car?': doc.owns_car ? 'Yes' : '',
      'Services offered': doc.services_offered || '',
      'WhatsApp': doc.group_links.whatsapp || '',
      'Facebook': doc.group_links.facebook || '',
      'Spoken languages': doc.spoken_languages || '',
      'Availability': doc.availability.join(', '),
      'volunteerid': String(doc.id)
    },
    geometry:{
        type: 'Point',
        coordinates: [
          coords.lng,
          coords.lat
        ]
    }
  }

  return result
}

module.exports = {
  parseSignUpToVolunteer,
  convertVolunteerToGeoJson
}