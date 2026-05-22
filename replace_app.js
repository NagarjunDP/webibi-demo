const fs = require('fs');
let code = fs.readFileSync('/Users/nagarjundp/auto-web/demo-template/src/App.jsx', 'utf8');

const newTracking = `// ── Firestore Tracking (called with ?wid=DEMO_ID) ──
const FIREBASE_PROJECT_ID = 'YOUR_FIREBASE_PROJECT_ID';

function useAnalytics(demoId) {
  useEffect(() => {
    if (!demoId || !FIREBASE_PROJECT_ID || FIREBASE_PROJECT_ID === 'YOUR_FIREBASE_PROJECT_ID') return;

    const sessionId = Math.random().toString(36).substring(2, 15);
    const startTime = Date.now();
    const viewedSections = new Set(['hero']);

    const openDocId = \`open_\${Date.now()}_\${sessionId}\`;
    fetch(\`https://firestore.googleapis.com/v1/projects/\${FIREBASE_PROJECT_ID}/databases/(default)/documents/opens?documentId=\${openDocId}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          demoId: { stringValue: demoId },
          sessionId: { stringValue: sessionId },
          openedAt: { timestampValue: new Date().toISOString() },
          userAgent: { stringValue: navigator.userAgent },
          referrer: { stringValue: document.referrer || 'Direct' },
          company: { stringValue: content.company },
          timeSpentSeconds: { integerValue: 0 },
          sectionsViewed: { arrayValue: { values: [{ stringValue: 'hero' }] } }
        }
      })
    }).catch(() => {});

    const updateInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const sections = Array.from(viewedSections).map(s => ({ stringValue: s }));
      fetch(\`https://firestore.googleapis.com/v1/projects/\${FIREBASE_PROJECT_ID}/databases/(default)/documents/opens/\${openDocId}?updateMask.fieldPaths=timeSpentSeconds&updateMask.fieldPaths=sectionsViewed&updateMask.fieldPaths=lastActive\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            timeSpentSeconds: { integerValue: timeSpent },
            sectionsViewed: { arrayValue: { values: sections } },
            lastActive: { timestampValue: new Date().toISOString() }
          }
        })
      }).catch(() => {});
    }, 5000);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.target.id) {
          viewedSections.add(e.target.id);
        }
      });
    }, { threshold: 0.3 });

    setTimeout(() => {
      document.querySelectorAll('section[id], div[id^="hero"]').forEach(el => observer.observe(el));
    }, 1000);

    return () => {
      clearInterval(updateInterval);
      observer.disconnect();
    };
  }, [demoId]);
}
`;

code = code.replace(/\/\/ ── Firestore Tracking[\s\S]*?\} catch \(e\) \{ \/\* silently fail \*\/ \}\n\}/, newTracking);

code = code.replace(/const wid = params\.get\('wid'\);\n\s+if \(wid\) trackOpen\(wid\);/g, `const wid = params.get('wid');
    if (wid) window.currentDemoId = wid; // stored for hook`);
    
code = code.replace(/export default function App\(\) \{/g, `export default function App() {
  const params = new URLSearchParams(window.location.search);
  const wid = params.get('wid');
  useAnalytics(wid);`);

fs.writeFileSync('/Users/nagarjundp/auto-web/demo-template/src/App.jsx', code);
console.log("App.jsx updated");
