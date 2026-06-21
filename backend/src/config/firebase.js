const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const credentialPath = process.env.FIREBASE_CREDENTIAL_PATH || './firebase-credentials.json';

const serviceAccount = require(path.resolve(credentialPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'sistemas-de-pedido',
});

const db = admin.firestore();

module.exports = { admin, db };
