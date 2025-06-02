// Vercel API route
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the request body
    const body = req.body;
    console.log('Received request body:', body);

    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' || req.headers.host.includes('localhost');

    if (isDevelopment) {
      // Forward the request to the localhost endpoint
      const localhostUrl = 'http://localhost:5678/webhook/d0b3516a-e6c1-488b-b8c5-b39f57c8a3eb/chat';
      console.log('Forwarding request to:', localhostUrl);

      try {
        const response = await fetch(localhostUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          console.error('Local server error:', response.status, response.statusText);
          throw new Error(`Local server responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response from local server:', data);
        return res.status(200).json(data);
      } catch (fetchError) {
        console.error('Local server fetch error:', fetchError);
        // If local server is not available, return a helpful error message
        return res.status(500).json({
          error: 'Failed to connect to local development server',
          message: 'Please make sure your local server is running at http://localhost:5678',
          details: fetchError.message
        });
      }
    } else {
      // In production, return a mock response based on the action
      console.log('Returning mock response in production for action:', body?.[0]?.action);
      let mockResponse = {
        type: 'text',
        text: "I'm a mock response from the production server. The local development server is not available in production.",
        error: false
      };

      if (body?.[0]?.action === 'loadPreviousSession') {
        mockResponse.text = "👋 Welcome to the SweepAI Demo! How can I help you today?";
      } else if (body?.[0]?.action === 'sendMessage') {
        mockResponse.text = `You said: ${body?.[0]?.chatInput}. This is a mock response.`;
      }

      return res.status(200).json([mockResponse]);
    }

  } catch (error) {
    console.error('Webhook internal error:', error);

    // For other internal errors, return a generic error message
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
} 