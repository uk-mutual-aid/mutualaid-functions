const admin = require('firebase-admin')
const functions = require('firebase-functions')
const axios = require('axios')

const CREATE_VOLUNTEER_SIGN_UP_RECORD_FUNCTION_NAME =
  'createVolunteerSignUpRecord'
// API_URL is expected to have a trailing forward slash
const { API_URL } = process.env

exports.volunteerSignUp = functions.https.onRequest(
  async (request, response) => {
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
      const collectionName = 'volunteer-sign-up-records'
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
