// Demo access configurations
const DEMO_ACCESS_CONFIG = {
    'isanti': {
        accessCode: process.env.ISANTI_DEMO_CODE,
        redirectUrl: '/demos/IsantiDemo/index.html',
        webhookurl: process.env.IsantiWebhookURL
    },
    'BoonFay': {
        accessCode: process.env.BOONFAY_DEMO_CODE,
        redirectUrl: '/demos/BoonFay/index.html',
        webhookurl: process.env.BoonFayWebhookURL,
        surveyurl: process.env.FitnessSurveyWebhookURL
    },
    'FitnessSurvey': {
        accessCode: process.env.FITNESS_SURVEY_DEMO_CODE,
        redirectUrl: '/demos/FitnessSurvey/index.html',
        webhookurl: process.env.FitnessSurveyWebhookURL
    },
    'GYM': {
        accessCode: process.env.GYM_DEMO_CODE,
        redirectUrl: '/demos/GYM/index.html',
        webhookurl: process.env.GYMWebhookURL
    }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing access code' 
      });
    }

    let demoConfig = null;
    let demoType = null;

    // Iterate through configured demos to find a matching access code
    for (const demoKey in DEMO_ACCESS_CONFIG) {
      if (DEMO_ACCESS_CONFIG[demoKey].accessCode === code) {
        demoConfig = DEMO_ACCESS_CONFIG[demoKey];
        demoType = demoKey;
        break;
      }
    }

    // Check if a matching demo configuration was found
    if (!demoConfig) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid access code'
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Access granted',
      redirectUrl: demoConfig.redirectUrl,
      token: `demo_${demoType}_${Date.now()}`,
      webhook: demoConfig.webhookurl
    });

  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 