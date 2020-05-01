const admin = require('firebase-admin')
const functions = require('firebase-functions')
const { readCsv } = require('./helpers')
const { parseGoogleFormResponseToSignUp, parseSignUpToVolunteer, convertVolunteerToGeoJson } = require('../functions/helpers')
const inputPath = '../tmp/data/1may.csv'

const serviceAccount = require('../tmp/keys/google-app-key.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()

const beginIndex = -200

async function main() {
  try {
    const rawSignUps = (await readCsv(inputPath)).slice(beginIndex)
    const signUpPayloads = rawSignUps.map(parseGoogleFormResponseToSignUp)
    const volunteerPayloads = signUpPayloads.map(parseSignUpToVolunteer)
    const volunteerGeoPayloads = await Promise.all(volunteerPayloads.map(convertVolunteerToGeoJson))

  await batchWrite('sign-ups', signUpPayloads)
  // await batchWrite('volunteers', volunteerPayloads)
  // await batchWrite('volunteer-geos', volunteerGeoPayloads)
  } catch(e) {
    console.error(e)
  }
}

async function batchWrite(collectionName, array) {
  let counter = 0
  let commits = 0
  let breakpoint = (counter != 0) && (counter % 500 === 0)
  const set = batch => async (docRef, item) => {
    console.log('setting...')
    batch.set(docRef, item)
    counter++
    if (breakpoint) await commit(batch)
  }

  const commit = async batch => {
    console.log('committing...')
    await batch.commit()
    commits++
  }

  let batch = db.batch()
  const collectionRef = db.collection(collectionName)
  array.forEach(async item => {  
    let docRef = collectionRef.doc()
    await set(batch)(docRef,item)
  })

  await commit(batch)
  console.log({ collectionName, commits, counter })
}

main()