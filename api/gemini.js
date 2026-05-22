export const config = {
  maxDuration: 60, // Set max duration for Vercel
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const geminiKey = process.env.GEMINI_API_KEY;
  const grokKey = process.env.GROK_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!geminiKey && !grokKey && !openRouterKey) {
    return res.status(500).json({ error: 'No AI API keys configured' });
  }

  // 1. Try Gemini first
  if (geminiKey) {
    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 4096 }
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return res.status(200).json({ text, source: 'gemini' });
      }
      console.warn('Gemini failed with status:', geminiRes.status, 'Trying Grok...');
    } catch (error) {
      console.warn('Gemini request failed:', error.message, 'Trying Grok...');
    }
  }

  // 2. Try Grok
  if (grokKey) {
    try {
      const grokRes = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grokKey}`
        },
        body: JSON.stringify({
          model: 'grok-4.20-reasoning',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.9
        })
      });

      if (grokRes.ok) {
        const data = await grokRes.json();
        const text = data.choices?.[0]?.message?.content || '';
        return res.status(200).json({ text, source: 'grok' });
      }
      console.warn('Grok failed with status:', grokRes.status, 'Trying OpenRouter...');
    } catch (error) {
      console.warn('Grok request failed:', error.message, 'Trying OpenRouter...');
    }
  }

  // 3. Try OpenRouter
  if (openRouterKey) {
    try {
      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://auto-web-seven.vercel.app',
          'X-Title': 'Auto-Webibi'
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.9
        })
      });

      if (openRouterRes.ok) {
        const data = await openRouterRes.json();
        const text = data.choices?.[0]?.message?.content || '';
        return res.status(200).json({ text, source: 'openrouter' });
      }
      
      const errText = await openRouterRes.text();
      return res.status(openRouterRes.status).json({ error: 'OpenRouter failed: ' + errText });
    } catch (error) {
      return res.status(500).json({ error: 'All AI APIs failed: ' + error.message });
    }
  }

  return res.status(500).json({ error: 'All primary APIs failed and no OpenRouter fallback available' });
}
