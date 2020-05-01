const { readCsv } = require('./helpers')
const { parseGoogleFormResponseToSignUp, parseSignUpToVolunteer, convertVolunteerToGeoJson } = require('../functions/helpers')
const inputPath = '../tmp/data/1may.csv'

async function main() {
  const rawSignUps = await readCsv(inputPath)
  const signUpPayloads = rawSignUps.map(parseGoogleFormResponseToSignUp)
  const volunteerPayloads = signUpPayloads.map(parseSignUpToVolunteer)
  const volunteerGeoPayloads = await Promise.all(volunteerPayloads.slice(0,1).map(convertVolunteerToGeoJson))
}



main()