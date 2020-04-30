const createVolunteer = (admin, db) => async (request, response) => {
  
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
}

module.exports = createVolunteer