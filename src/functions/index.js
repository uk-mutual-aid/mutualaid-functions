const admin = require('firebase-admin')
const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.volunteerSignUp = functions.https.onRequest((request, response) => {
  const { body, method, params } = request
  console.log({ body, method, params })
  response.send('Hello from Firebase!')
})

admin.initializeApp()
let db = admin.firestore()

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
