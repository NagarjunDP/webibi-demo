const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

async function test() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)),
    });
  }

  const db = admin.firestore();
  
  const collections = await db.listCollections();
  console.log("Collections:", collections.map(c => c.id));
}

test();
