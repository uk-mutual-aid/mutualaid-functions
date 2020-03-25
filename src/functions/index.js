const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.volunteerSignUp = functions.https.onRequest((request, response) => {
  console.log(request)
  response.send('Hello from Firebase!')
})
