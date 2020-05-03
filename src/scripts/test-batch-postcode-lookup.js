const { readCsv, batchLookUpPostcodes } = require('./helpers')
const { parseGoogleFormResponseToSignUp } = require('../functions/helpers')
const inputPath = '../tmp/data/1may.csv'

const beginIndex = -150

async function main () {
  try {
  const rawSignUps = (await readCsv(inputPath)).slice(beginIndex)
  const signUpPayloads = rawSignUps.map(parseGoogleFormResponseToSignUp)
  const postcodes = signUpPayloads.map(signUpPayload => signUpPayload.postcode)
  batchLookUpPostcodes(postcodes)
  } catch(e) {
    console.error(e)
  }
}

main()

