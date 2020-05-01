const admin = require('firebase-admin')

const serviceAccount = require('../tmp/keys/google-app-key.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()

async function main() {
  const result = await db.collection('test').add({ name: 'naz' })
}

main()