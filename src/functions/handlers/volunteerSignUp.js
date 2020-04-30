const axios = require('axios')
const { API_URL } = process.env

const CREATE_SIGN_UP_FUNCTION_NAME = 'createSignUp'
async function volunteerSignUp (request, response) {
    const formItemTitleToKeyMap = {
      Availability: 'availability',
      'Contact Number': 'contact_number',
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
      // console.log({ obj, map})
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

    try {
      const { body } = request
      console.log(body)
      let signUpData = body

      // below is a hack because we had to call Array.string() from the Script Editor side to solve the java.lang issue
      const keysMeantToBeArrays = [
        'Availability',
        'I am a...',
        'Data Privacy Consent',
        'Do you have a car?'
      ]
      // todo: move below to new parseData function
      signUpData = certainStringValuesToArray(keysMeantToBeArrays, signUpData)
      signUpData = changeObjectKeys(signUpData, formItemTitleToKeyMap)
      signUpData = parseBoolQuestionValues(signUpData, boolQuestionMap)

      const createRecordUrl =
        API_URL + CREATE_SIGN_UP_FUNCTION_NAME
      const postResult = await axios.post(createRecordUrl, signUpData).data
      response.send(postResult)
    } catch (e) {
      console.error(e)
      response.send(JSON.stringify(e))
    }
  }

  module.exports = volunteerSignUp