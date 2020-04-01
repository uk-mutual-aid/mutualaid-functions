const admin = require('firebase-admin')
const functions = require('firebase-functions')
const axios = require('axios')

const CREATE_VOLUNTEER_SIGN_UP_RECORD_FUNCTION_NAME =
  'createVolunteerSignUpRecord'
// API_URL is expected to have a trailing forward slash
const { API_URL } = process.env

exports.volunteerSignUp = functions.https.onRequest(
  async (request, response) => {
    const formItemTitleToKeyMap = {
      Availability: 'availability',
      'Contact Number': 'contact_number',
      'Data privacy consent': 'data_privacy_consent',
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
    try {
      const { body } = request
      let signUpData = body

      // below is a hack because we had to call Array.string() from the Script Editor side to solve the java.lang issue
      const keysMeantToBeArrays = [
        'Availability',
        'I am a...',
        'Data Privacy Consent',
        'Do you have a car?'
      ]
      signUpData = certainStringValuesToArray(keysMeantToBeArrays, signUpData)
      signUpData = changeObjectKeys(signUpData, formItemTitleToKeyMap)

      const createRecordUrl =
        API_URL + CREATE_VOLUNTEER_SIGN_UP_RECORD_FUNCTION_NAME
      const postResult = await axios.post(createRecordUrl, signUpData).data
      response.send(postResult)
    } catch (e) {
      console.error(e)
      response.send(JSON.stringify(e))
    }
  }
)

admin.initializeApp()
const db = admin.firestore()

exports.createVolunteerSignUpRecord = functions.https.onRequest(
  async (request, response) => {
    try {
      const { body } = request
      const collectionName = 'sign-up-records-raw'
      const result = await db
        .collection(collectionName)
        .doc()
        .set(body)
      response.send(result)
    } catch (e) {
      console.error(e)
      response.send(JSON.stringify(e))
    }
  }
)
