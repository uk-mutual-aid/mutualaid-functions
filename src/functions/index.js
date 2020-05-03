const admin = require('firebase-admin')
const functions = require('firebase-functions')
const handlers = require('./handlers')
const helpers = require('./helpers')

// API_URL is expected to have a trailing forward slash
const { API_URL } = process.env
if (API_URL === undefined) console.error('API_URL is undefined')

admin.initializeApp()
const db = admin.firestore()

exports.volunteerSignUp = functions.https.onRequest(handlers.volunteerSignUp)

exports.createSignUp = functions.https.onRequest(handlers.createSignUp(db))

exports.createVolunteer = functions.https.onRequest(handlers.createVolunteer(admin, db))

exports.getVolunteersGeoJson = functions.https.onRequest(async (request, response) => {
  try{
    const volunteerGeos = []
    const snapshots = await db.collection('volunteer-geos').get()
    snapshots.forEach(snapshot => volunteerGeos.push(snapshot.data()))
    response.send(volunteerGeos)

  } catch (e) {
    console.error(e)
    response.send(JSON.stringify(e))
  }


})

exports.getVolunteer = functions.https.onCall(async ({ id }, _) => {
  const docRef = db.collection('volunteers').doc(id)
  return (await docRef.get()).data()
})