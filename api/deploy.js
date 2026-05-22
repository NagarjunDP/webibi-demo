export const config = {
  api: {
    bodyParser: false, // Disallow body parsing to handle raw zip stream
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) {
    return res.status(500).json({ error: 'VERCEL_TOKEN is not configured in backend' });
  }

  try {
    // Pipe the request body directly to Vercel Deploy API
    const vercelReq = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': req.headers['content-type'] || 'application/octet-stream',
      },
      body: req,
      duplex: 'half' // required for streaming requests in Node 18+
    });

    if (!vercelReq.ok) {
      const errText = await vercelReq.text();
      return res.status(vercelReq.status).json({ error: errText });
    }

    const data = await vercelReq.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
