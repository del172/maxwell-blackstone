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
    const { caseData, evidence, analysis } = req.body;
    
    if (!caseData || !evidence || !analysis) {
      return res.status(400).json({ error: 'Invalid request. Required: caseData, evidence, and analysis' });
    }
    
    // In a real app, this would use AI to generate defence strategies
    // For now, returning mock data
    const defenceStrategy = {
      id: 'strategy_' + Date.now(),
      caseId: caseData.id,
      createdAt: new Date().toISOString(),
      primaryDefence: {
        type: 'factual_dispute',
        title: 'Challenge to Prosecution Evidence',
        description: 'Challenge the reliability and consistency of prosecution evidence, highlighting contradictions identified in witness statements.',
        strength: 'high',
        arguments: [
          {
            title: 'Timeline Inconsistencies',
            content: 'Witness statements contain significant inconsistencies regarding the timing of events, undermining their reliability.',
            evidenceRefs: [evidence[0].id]
          },
          {
            title: 'Identification Issues',
            content: 'Descriptions of the alleged perpetrator vary significantly between witnesses, raising reasonable doubt about identification.',
            evidenceRefs: [evidence.length > 1 ? evidence[1].id : evidence[0].id]
          }
        ],
        caseLawRefs: ['R v Turnbull [1977] QB 224', 'R v Smith [2020] EWCA Crim 1234']
      },
      alternativeDefences: [
        {
          type: 'legal_argument',
          title: 'Insufficient Evidence',
          description: 'Argue that the prosecution has not met the burden of proof required for conviction.',
          strength: 'medium',
          arguments: [
            {
              title: 'Burden of Proof',
              content: 'The prosecution must prove guilt beyond reasonable doubt, which they have failed to do given the inconsistencies in evidence.'
            }
          ],
          caseLawRefs: ['Woolmington v DPP [1935] AC 462']
        }
      ],
      proceduralRecommendations: [
        {
          title: 'Disclosure Request',
          description: 'Request full disclosure of all prosecution evidence, including any CCTV footage or digital evidence mentioned in witness statements.'
        },
        {
          title: 'Expert Witness',
          description: 'Consider instructing an expert witness to challenge technical aspects of prosecution evidence if applicable.'
        }
      ]
    };
    
    return res.status(200).json({ defenceStrategy });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
