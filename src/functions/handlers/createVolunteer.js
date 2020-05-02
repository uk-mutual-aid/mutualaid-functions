const models = require('../models')
const helpers = require('../helpers')

const createVolunteer = (admin, db) => async (request, response) => {
  try {
    const { body: volunteerPayload } = request
    const volunteer = models.volunteer(admin, db)
    const result = await volunteer.add(volunteerPayload)
    const volunteerGeoPayload = helpers.convertVolunteerToGeoJson(volunteerPayload)
    

    response.send(result)
  } catch (e) {
    console.error(e)
    response.send(JSON.stringify(e))
  }
}

module.exports = createVolunteer