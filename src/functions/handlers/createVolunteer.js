const models = require('../models')

const createVolunteer = (admin, db) => async (request, response) => {
  try {
    const { body } = request
    const volunteer = models.volunteer(admin, db)
    const result = await volunteer.add(body)

    response.send(result)
  } catch (e) {
    console.error(e)
    response.send(JSON.stringify(e))
  }
}

module.exports = createVolunteer