const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

async function run() {
  const session = { phoneNumber: '+918792248260' };
  const now = Date.now();

  try {
    const demosSnap = await db.collection('demos')
      .where('agentPhone', '==', session.phoneNumber)
      .get();
    
    let demosList = demosSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        generatedAt: data.generatedAt?.toDate ? data.generatedAt.toDate().toISOString() : data.generatedAt,
        expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate().toISOString() : data.expiresAt,
        sentAt: data.sentAt?.toDate ? data.sentAt.toDate().toISOString() : data.sentAt,
      };
    });

    const opensSnap = await db.collection('opens')
      .where('agentPhone', '==', session.phoneNumber)
      .get();
    
    let opensList = opensSnap.docs.map(doc => doc.data());

    demosList.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

    const analyticsMap = {};
    opensList.forEach((open) => {
      if (!analyticsMap[open.demoSlug]) {
        analyticsMap[open.demoSlug] = {
           viewsCount: open.viewsCount || 1,
           totalMinutes: open.totalMinutes || 0,
           lastActive: open.lastActive,
           device: open.device || 'Unknown',
           firstOpened: open.firstOpened
        };
      } else {
        analyticsMap[open.demoSlug].viewsCount += (open.viewsCount || 1);
        analyticsMap[open.demoSlug].totalMinutes += (open.totalMinutes || 0);
        if (new Date(open.lastActive).getTime() > new Date(analyticsMap[open.demoSlug].lastActive).getTime()) {
           analyticsMap[open.demoSlug].lastActive = open.lastActive;
           analyticsMap[open.demoSlug].device = open.device;
        }
      }
    });

    const results = demosList.map(demo => {
      const expiresAtMs = new Date(demo.expiresAt).getTime();
      const analytics = analyticsMap[demo.slug] || { viewsCount: 0, totalMinutes: 0, device: 'Unknown', lastActive: null, firstOpened: null };
      return {
        ...demo,
        expired: expiresAtMs < now,
        opensCount: analytics.viewsCount,
        totalMinutes: analytics.totalMinutes,
        lastActive: analytics.lastActive ? new Date(analytics.lastActive).toISOString() : null,
        device: analytics.device,
        firstOpened: analytics.firstOpened ? new Date(analytics.firstOpened).toISOString() : null
      };
    });

    console.log("SUCCESS!", results.length, "results");
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
  }
}
run();
