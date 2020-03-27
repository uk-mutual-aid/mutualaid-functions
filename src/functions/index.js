const admin = require('firebase-admin')
const functions = require('firebase-functions')
const axios = require('axios')

const CREATE_VOLUNTEER_SIGN_UP_RECORD_FUNCTION_NAME =
  'createVolunteerSignUpRecord'
// API_URL is expected to have a trailing forward slash
const { API_URL } = process.env

exports.volunteerSignUp = functions.https.onRequest(
  async (request, response) => {
    try {
      const { body } = request
      const createRecordUrl =
        API_URL + CREATE_VOLUNTEER_SIGN_UP_RECORD_FUNCTION_NAME
      const postResult = await axios.post(createRecordUrl, body).data
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
    const { body } = request
    const collectionName = 'volunteer-sign-up-records'
    const result = await db
      .collection(collectionName)
      .doc()
      .set(body)
    response.send(result)
  }
)
