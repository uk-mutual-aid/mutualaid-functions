const axios = require('axios')
const { API_URL } = process.env
const helpers = require('../helpers')

const CREATE_SIGN_UP_FUNCTION_NAME = 'createSignUp'
async function volunteerSignUp (request, response) {
    try {
      const { body } = request
      let signUpData = helpers.parseGoogleFormResponseToSignUp(body)

      const createRecordUrl =
        API_URL + CREATE_SIGN_UP_FUNCTION_NAME
      const postResult = await axios.post(createRecordUrl, signUpData).data
      response.send(postResult)
    } catch (e) {
      console.error(e)
      response.send(JSON.stringify(e))
    }
  }

  module.exports = volunteerSignUp