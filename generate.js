export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { businessType, teamSize, timewaster, tools } = req.body
  if (!businessType || !timewaster) return res.status(400).json({ error: 'Missing fields' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API not configured' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `You are FlowwayAI's automation architect. Generate a specific AI workflow blueprint.

Business: ${businessType}
Team: ${teamSize || 'Not specified'}
Problem: ${timewaster}
Tools: ${tools || 'Not specified'}

Return ONLY valid JSON (no markdown, no backticks):
{
  "blueprintName": "Specific compelling name",
  "problem": "One sentence describing the exact problem",
  "steps": [
    {"step":1,"title":"Title","description":"Specific what/how/why","tool":"Real tool name"},
    {"step":2,"title":"Title","description":"Specific what/how/why","tool":"Real tool name"},
    {"step":3,"title":"Title","description":"Specific what/how/why","tool":"Real tool name"},
    {"step":4,"title":"Title","description":"Specific what/how/why","tool":"Real tool name"},
    {"step":5,"title":"Title","description":"Specific what/how/why","tool":"Real tool name"}
  ],
  "timeSaved": "X–Y hours per week",
  "moneySaved": "$X,XXX–$X,XXX",
  "difficulty": "Easy",
  "quickWin": "Specific first action they can take this week"
}`
        }]
      })
    })

    if (!response.ok) return res.status(500).json({ error: 'Claude API error' })
    const data = await response.json()
    const text = data.content?.[0]?.text?.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()
    return res.status(200).json(JSON.parse(text))
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate' })
  }
}
