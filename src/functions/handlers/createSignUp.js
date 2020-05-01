const axios = require('axios')
const helpers = require('../helpers')
const { API_URL } = process.env
const CREATE_VOLUNTEER_FUNCTION_NAME = 'createVolunteer'
const models = require('../models')

const createSignUp = (db) => async (request, response) => {
  try {
    const { body } = request
    
    const signUp = models.signUp(db)
    const result = await signUp.add(body)

    const createVolunteerPayload = helpers.parseSignUpToVolunteer(body, result.id)
    const createVolunteerUrl = API_URL + CREATE_VOLUNTEER_FUNCTION_NAME
    const postResult = await axios.post(createVolunteerUrl, createVolunteerPayload).data
    response.send(postResult)
  } catch (e) {
    console.error(e)
    response.send(JSON.stringify(e))
  }
}

module.exports = createSignUp