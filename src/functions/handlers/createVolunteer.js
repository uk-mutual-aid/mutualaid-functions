const models = require('../models')
const helpers = require('../helpers')

const createVolunteer = (admin, db) => async (request, response) => {
  try {
    const { body: volunteerPayload } = request
    const volunteer = models.volunteer(admin, db)
    const volunteerAddResult = await volunteer.add(volunteerPayload)
    const volunteerGeoPayload = await helpers.convertVolunteerToGeoJson(volunteerAddResult)
    const volunteerGeo = models.volunteerGeo(db)
    await volunteerGeo.add(volunteerGeoPayload)

    response.send({})
  } catch (e) {
    console.error(e)
    response.send(JSON.stringify(e))
  }
}

module.exports = createVolunteer