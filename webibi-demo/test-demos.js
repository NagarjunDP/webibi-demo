const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function test() {
  try {
    const demosSnap = await db.collection('demos')
      .where('agentPhone', '==', '+918792248260')
      .get();
    
    console.log(`Found ${demosSnap.size} demos.`);
    
    demosSnap.docs.forEach(doc => {
        const data = doc.data();
        console.log(data);
    });

  } catch (err) {
    console.error("Firebase error:", err);
  }
}

test();
