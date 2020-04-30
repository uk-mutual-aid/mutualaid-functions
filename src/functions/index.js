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
    const volunteers = []

    const snapshots = await db.collection('volunteers').get()
    snapshots.forEach(snapshot => volunteers.push(snapshot.data()))

    // TODO: remove below .slice() after implementation is confirmed
    const result = volunteers.slice(0,1).map(async volunteer => await helpers.convertVolunteerToGeoJson(volunteer))
  
    response.send({})

  } catch (e) {
    console.error(e)
    response.send(JSON.stringify(e))
  }


})

exports.getVolunteer = functions.https.onCall(async ({ id }, _) => {
  const docRef = db.collection('volunteers').doc(id)
  return (await docRef.get()).data()
})