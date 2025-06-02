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

    // Check if we're in development mode (running on localhost)
    const isDevelopment = process.env.NODE_ENV === 'development' || req.headers.host.includes('localhost');

    let targetWebhookUrl;

    if (isDevelopment) {
      // In development, forward to local n8n instance
      targetWebhookUrl = 'http://localhost:5678/webhook/d0b3516a-e6c1-488b-b8c5-b39f57c8a3eb/chat';
      console.log('Forwarding request to local n8n:', targetWebhookUrl);
    } else {
      // In production, forward to the public n8n webhook on Render
      targetWebhookUrl = 'https://sweepdemo-workflow.onrender.com/webhook/d0b3516a-e6c1-488b-b8c5-b39f57c8a3eb/chat';
      console.log('Forwarding request to public n8n on Render:', targetWebhookUrl);
    }

    try {
      const response = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally forward other relevant headers from the original request
          // ...req.headers // Be cautious about forwarding all headers
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        console.error('Target webhook responded with status:', response.status, response.statusText);
        // Attempt to read response body for more details if available
        const errorBody = await response.text().catch(() => 'No response body');
        console.error('Target webhook error body:', errorBody);
        throw new Error(`Target webhook responded with status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response from target webhook:', data);
      return res.status(response.status).json(data); // Pass through the status code

    } catch (fetchError) {
      console.error('Error forwarding request to target webhook:', fetchError);
      // Provide a helpful error message if the target webhook is unreachable or returns an error
      const userErrorMessage = isDevelopment 
        ? 'Failed to connect to local n8n instance. Please make sure it is running.'
        : 'Failed to connect to the public n8n webhook. Please check the n8n service.';

      return res.status(500).json({
        error: userErrorMessage,
        details: fetchError.message
      });
    }

  } catch (error) {
    console.error('Webhook internal error:', error);
    // For other internal errors in the Vercel function itself
    return res.status(500).json({
      error: 'Internal server error in Vercel function',
      message: error.message
    });
  }
} 