import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;
let bucket: any = null;
let auth: admin.auth.Auth | null = null;
let firebaseInitialized = false;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.firebasestorage.app` || `${serviceAccount.project_id}.appspot.com`
      });
    }
    db = admin.firestore();
    bucket = admin.storage().bucket();
    auth = admin.auth();
    firebaseInitialized = true;
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (e: any) {
    console.error("Error initializing Firebase Admin: ", e.message);
  }
} else {
  console.warn("FIREBASE_SERVICE_ACCOUNT_JSON is missing. Operating in MOCK mode.");
}

// Let's create static global maps that persist in memory during development
// Next.js hot reloading can clear these, but they are fine for local testing.
// In production, Firebase will always be initialized.
if (!(global as any)._mockDemos) {
  (global as any)._mockDemos = new Map<string, any>();
  (global as any)._mockOpens = [];
  (global as any)._mockOtps = new Map<string, { code: string; expiresAt: number }>();
}

const mockDemos = (global as any)._mockDemos as Map<string, any>;
const mockOpens = (global as any)._mockOpens as any[];
const mockOtps = (global as any)._mockOtps as Map<string, { code: string; expiresAt: number }>;

export function getFirebaseAdmin() {
  return {
    db,
    bucket,
    auth,
    firebaseInitialized,
    mockDb: {
      demos: mockDemos,
      opens: mockOpens,
      otps: mockOtps
    }
  };
}
