const signUp = db => ({
  add: (doc) => db.collection('sign-ups').add(doc)
})

module.exports = {
  signUp
}