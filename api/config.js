export default function handler(req, res) {
  res.status(200).json({
    projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project'
  });
}
