const admin = require('firebase-admin')
const functions = require('firebase-functions')
const { batchLookUpPostcodes, batchLookUpAccessor ,readCsv } = require('./helpers')
const { parseGoogleFormResponseToSignUp, parseSignUpToVolunteer, convertVolunteerToGeoJson } = require('../functions/helpers')
const inputPath = '../tmp/data/1may.csv'

var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('tmp/log.txt', { flags: 'w' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

const serviceAccount = require('../tmp/keys/google-app-key.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()

const beginIndex = -3

async function main() {
  try {
    const rawSignUps = (await readCsv(inputPath)).slice(beginIndex)
    const signUpPayloads = rawSignUps.map(parseGoogleFormResponseToSignUp)
    const volunteerIds = rawSignUps.map(rawSignUp => rawSignUp.ID)

    const volunteerPayloads = signUpPayloads.map(signUpPayload => parseSignUpToVolunteer(signUpPayload))
    const volunteerPayloadsWithIds = volunteerPayloads.map(( volunteerPayload, index) => ({ ...volunteerPayload, number_id: Number(volunteerIds[index]) }) )

    const postcodes = signUpPayloads.map(signUpPayload => signUpPayload.postcode)
    const postcodesMap = await batchLookUpPostcodes(postcodes)

    const volunteerGeoPayloads = await Promise.all(volunteerPayloadsWithIds.map(volunteerPayload => convertVolunteerToGeoJson(volunteerPayload, batchLookUpAccessor(postcodesMap))))

    await batchWrite('sign-ups', signUpPayloads)
    await batchWrite('volunteers', volunteerPayloads)
    await batchWrite('volunteer-geos', volunteerGeoPayloads)
  } catch(e) {
    console.error(e)
  }
}

async function batchWrite(collectionName, array) {
  const collectionRef = db.collection(collectionName)
  const batchArray = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;

  array.forEach(item => {

      // update document data here...
      const docRef = collectionRef.doc()
      batchArray[batchIndex].set(docRef, item);
      operationCounter++;

      if (operationCounter === 499) {
        batchArray.push(db.batch());
        batchIndex++;
        operationCounter = 0;
      }
  });

  batchArray.forEach(async batch => await batch.commit());
  console.log('batch write completed for ', collectionName)
  return;
}

main()