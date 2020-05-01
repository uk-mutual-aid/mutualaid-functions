const axios = require('axios')
const { POSTCODE_LOOKUP_URL } = process.env

function parseGoogleFormResponseToSignUp(input) {
  const formItemTitleToKeyMap = {
    Availability: 'availability',
    'Data privacy consent': 'data_privacy_consent',
    'Contact number': 'contact_number',
    Discord: 'discord',
    'Do you have a car?': 'owns_car',
    Email: 'email',
    Facebook: 'facebook',
    'I am a...': 'roles',
    'I speak English and...': 'spoken_languages',
    Postcode: 'postcode',
    'Services offered': 'services_offered',
    Telegram: 'telegram',
    Whatsapp: 'whatsapp',
    'Your name': 'name'
  }

  function changeObjectKeys(obj, map) {
    let result = {}
    const mapKeys = Object.keys(map)
    mapKeys.forEach(mapKey => {
      let value = obj[mapKey]
      let newKey = map[mapKey]
      result[newKey] = value
    })
    return result
  }

  function certainStringValuesToArray(targetKeys, object) {
    /* transforms certain values of the object from string to array, using comma as the separator, based on the keys provided*/
    const keys = Object.keys(object)
    keys.forEach(key => {
      if (targetKeys.includes(key)) {
        object[key] = object[key].split(',')
      }
    })
    return object
  }

  const boolQuestionMap = {
    owns_car: {
      Yes: true,
      No: false
    }
  }

  function parseBoolQuestionValues(obj, map) {
    const questionKeys = Object.keys(map)
    questionKeys.forEach(questionKey => {
      // assumes that the value is an array
      const answerArray = obj[questionKey]
      const firstValue = answerArray[0]
      const mapObject = map[questionKey]
      const resultingValue = mapObject[firstValue]
      obj[questionKey] = resultingValue
    })
    return obj
  }

      // below is a hack because we had to call Array.string() from the Script Editor side to solve the java.lang issue
      const keysMeantToBeArrays = [
        'Availability',
        'I am a...',
        'Data Privacy Consent',
        'Do you have a car?'
      ]
      // todo: move below to new parseData function
      let result = certainStringValuesToArray(keysMeantToBeArrays, input)
      result = changeObjectKeys(result, formItemTitleToKeyMap)
      result = parseBoolQuestionValues(result, boolQuestionMap)

      // hack
      if (result.whatsapp === undefined ) result.whatsapp = ''

      return result
}


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
  try {
    const axiosResponse = await axios.get(POSTCODE_LOOKUP_URL + postcode)
    const lookupResult = axiosResponse.data.result
    const { latitude: lat, longitude: lng } = lookupResult
    return ({ lat, lng  })
  } catch(e) {
    console.error(postcode)
  }
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
  parseGoogleFormResponseToSignUp,
  parseSignUpToVolunteer,
  convertVolunteerToGeoJson
}