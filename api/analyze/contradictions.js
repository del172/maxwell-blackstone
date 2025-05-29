module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get request body
    const { text, evidence } = req.body;
    
    if (!text || !evidence || !Array.isArray(evidence)) {
      return res.status(400).json({ error: 'Invalid request. Required: text and evidence array' });
    }
    
    // In a real app, this would use NLP to detect contradictions
    // For now, returning mock data
    const contradictions = [
      {
        id: 'contradiction_001',
        type: 'factual',
        description: 'Inconsistent timeline of events',
        evidence1: evidence[0].id,
        evidence2: evidence.length > 1 ? evidence[1].id : null,
        details: 'The first statement claims the event occurred at 10pm, while the second statement indicates it was around 8pm.'
      },
      {
        id: 'contradiction_002',
        type: 'descriptive',
        description: 'Inconsistent physical descriptions',
        evidence1: evidence[0].id,
        evidence2: evidence.length > 1 ? evidence[1].id : null,
        details: 'The first witness describes a tall person with dark hair, while the second witness mentions a short person with light hair.'
      }
    ];
    
    return res.status(200).json({ contradictions });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
