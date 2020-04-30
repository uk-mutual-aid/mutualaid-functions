const admin = require('firebase-admin')
const functions = require('firebase-functions')
const axios = require('axios')
const handlers = require('./handlers')
const helpers = require('./helpers')

const CREATE_VOLUNTEER_FUNCTION_NAME = 'createVolunteer'
// API_URL is expected to have a trailing forward slash
const { API_URL } = process.env
if (API_URL === undefined) console.error('API_URL is undefined')

exports.volunteerSignUp = functions.https.onRequest(handlers.volunteerSignUp)

admin.initializeApp()
const db = admin.firestore()

exports.createSignUp = functions.https.onRequest(async (request, response) => {
  try {
    const { body } = request
    const collectionName = 'sign-ups'
    const result = await db
      .collection(collectionName)
      .add(body)
    const createVolunteerPayload = helpers.parseSignUpToVolunteer(body, result.id)
    const createVolunteerUrl = API_URL + CREATE_VOLUNTEER_FUNCTION_NAME
    const postResult = await axios.post(createVolunteerUrl, createVolunteerPayload).data
    response.send(postResult)
  } catch (e) {
    console.error(e)
    response.send(JSON.stringify(e))
  }
})

exports.createVolunteer = functions.https.onRequest(async (request, response) => {
  
  try {
    const { body } = request
    // TODO: validate body matches schema
    const collectionName = 'volunteers'
    // get current ID for volunteers
    const volunteersMetaRef = db.collection('collections-meta').doc(collectionName)
    const volunteersMeta = (await volunteersMetaRef.get()).data()
    let currentId
    if (volunteersMeta === undefined) {
      currentId = 0
      const initial = { current_id: 0}
      await db.collection('collections-meta').doc(collectionName).set(initial)
    } else {
      currentId = volunteersMeta.current_id
    }
    // use Firestore's increment atomic update feature
    const increment = admin.firestore.FieldValue.increment(1)
    // set volunteer to have numeric id
    const payload = { ...body, number_id: currentId + 1 }
    

    const result = await db
      .collection(collectionName)
      .doc()
      .set(payload)

    // update the current ID for volunteers
    await volunteersMetaRef.update({ current_id: increment })

    response.send(result)
  } catch (e) {
    console.error(e)
    response.send(JSON.stringify(e))
  }
})

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