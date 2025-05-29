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
    // Sample case law data
    const caseLawData = [
      {
        id: 'case_001',
        title: 'R v Smith',
        year: 2020,
        citation: '[2020] EWCA Crim 1234',
        court: 'Court of Appeal',
        summary: 'Appeal against conviction for theft. The Court considered the application of the Theft Act 1968 to digital assets.'
      },
      {
        id: 'case_002',
        title: 'R v Jones',
        year: 2019,
        citation: '[2019] UKSC 12',
        court: 'Supreme Court',
        summary: 'Appeal concerning admissibility of evidence obtained through digital surveillance.'
      },
      {
        id: 'case_003',
        title: 'R v Williams',
        year: 2021,
        citation: '[2021] EWCA Crim 618',
        court: 'Court of Appeal',
        summary: 'Appeal against sentence for offences under the Computer Misuse Act 1990.'
      }
    ];
    
    return res.status(200).json(caseLawData);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
