export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const vercelToken = process.env.VERCEL_TOKEN;

  if (!vercelToken) {
    return res.status(500).json({ error: 'VERCEL_TOKEN is not configured' });
  }

  try {
    const response = await fetch(`https://api.vercel.com/v13/deployments/${id}`, {
      headers: { 'Authorization': `Bearer ${vercelToken}` }
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
