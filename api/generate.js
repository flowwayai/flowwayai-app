export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { businessType, teamSize, timewaster, tools } = req.body

  if (!businessType || !timewaster) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

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
          content: `You are FlowwayAI's senior automation architect. Generate a specific, highly actionable AI workflow blueprint.

Business Type: ${businessType}
Team Size: ${teamSize || 'Not specified'}
Biggest Time-Waster: ${timewaster}
Current Tools: ${tools || 'Not specified'}

Return ONLY a valid JSON object (no markdown, no backticks, no explanation). Exactly this structure:
{
  "blueprintName": "A specific compelling name for this automation (e.g. 'Coach Lead-to-Call Booking Engine')",
  "problem": "One precise sentence describing the exact revenue-leaking problem being solved",
  "steps": [
    {"step": 1, "title": "Short action title", "description": "Specific description of what happens, how it works, and why it matters for this business type", "tool": "Specific tool name(s)"},
    {"step": 2, "title": "Short action title", "description": "Specific description", "tool": "Specific tool name(s)"},
    {"step": 3, "title": "Short action title", "description": "Specific description", "tool": "Specific tool name(s)"},
    {"step": 4, "title": "Short action title", "description": "Specific description", "tool": "Specific tool name(s)"},
    {"step": 5, "title": "Short action title", "description": "Specific description", "tool": "Specific tool name(s)"}
  ],
  "timeSaved": "X-Y hours per week",
  "moneySaved": "$X,XXX–$X,XXX per month in recovered revenue",
  "difficulty": "Easy",
  "quickWin": "The single highest-impact first action they should take this week, written as a specific instruction"
}

Make it highly specific to their business type and problem. Use real tool names (Make.com, Manychat, Airtable, Brevo, Calendly, Typeform, Notion, n8n, WhatsApp Business, Google Sheets, Slack, etc). Make the numbers realistic and compelling.`
        }]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', errText)
      return res.status(500).json({ error: 'Failed to generate blueprint' })
    }

    const data = await response.json()
    const content = data.content?.[0]?.text || ''

    // Clean any accidental markdown
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const blueprint = JSON.parse(cleaned)

    return res.status(200).json(blueprint)

  } catch (err) {
    console.error('Error:', err.message)
    return res.status(500).json({ error: 'Failed to generate blueprint' })
  }
}
