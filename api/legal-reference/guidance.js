module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Sample CPS guidance data
    const guidanceData = [
      {
        id: 'guidance_001',
        title: 'Theft Act Offences',
        category: 'Charging',
        updated: '2023-01-15',
        summary: 'Guidance on charging decisions for Theft Act offences including theft, robbery, and burglary.'
      },
      {
        id: 'guidance_002',
        title: 'Disclosure Manual',
        category: 'Disclosure',
        updated: '2022-11-30',
        summary: 'Guidance on meeting disclosure obligations under the Criminal Procedure and Investigations Act 1996.'
      },
      {
        id: 'guidance_003',
        title: 'Youth Offenders',
        category: 'Youth Justice',
        updated: '2023-03-10',
        summary: 'Guidance on handling cases involving defendants under 18 years of age.'
      }
    ];
    
    return res.status(200).json(guidanceData);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
