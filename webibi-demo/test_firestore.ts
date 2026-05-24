import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    console.error("No service account");
    return;
  }
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)),
    });
  }

  const db = admin.firestore();
  
  const docRef = db.collection('users').doc('+918792248260');
  const doc = await docRef.get();
  
  console.log("Exists:", doc.exists);
  if (doc.exists) {
    console.log("Data:", doc.data());
  } else {
    console.log("Doc does not exist! Let's list all users:");
    const snapshot = await db.collection('users').get();
    snapshot.forEach(d => {
      console.log(`Found doc: '${d.id}'`, d.data());
    });
  }
}

test();
