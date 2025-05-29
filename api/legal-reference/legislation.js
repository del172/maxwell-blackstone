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
    // Sample legislation data
    const legislationData = [
      {
        id: 'legislation_001',
        title: 'Criminal Justice Act 2003',
        year: 2003,
        reference: 'c. 44',
        category: 'Criminal Procedure',
        summary: 'An Act to make provision about criminal justice including the powers and duties of the police...'
      },
      {
        id: 'legislation_002',
        title: 'Police and Criminal Evidence Act 1984',
        year: 1984,
        reference: 'c. 60',
        category: 'Criminal Procedure',
        summary: 'An Act to make provision in relation to the powers and duties of the police...'
      },
      {
        id: 'legislation_003',
        title: 'Theft Act 1968',
        year: 1968,
        reference: 'c. 60',
        category: 'Offences',
        summary: 'An Act to revise the law of England and Wales as to theft and similar offences...'
      }
    ];
    
    return res.status(200).json(legislationData);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
