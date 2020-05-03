const signUp = db => ({
  add: (doc) => db.collection('sign-ups').add(doc)
})

const volunteer = (admin, db) => ({
  add: async (doc) => {
    try {
       // get current ID for volunteers
       const collectionName = 'volunteers'
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
       const payload = { ...doc, number_id: currentId + 1 }
       const result = await db.collection(collectionName).add(payload)
       // update the current ID for volunteers
       await volunteersMetaRef.update({ current_id: increment })
       return result
      } catch(e) {
        console.error(e)
      }
    }
})

const volunteerGeo = db => ({
  add: (doc) => db.collection('volunteer-geos').add(doc)
})

module.exports = {
  signUp,
  volunteer,
  volunteerGeo
}