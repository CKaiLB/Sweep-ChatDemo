export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, sessionId, route, chatInput, metadata } = req.body[0];

    // Mock response for testing
    const response = {
      output: action === 'loadPreviousSession' 
        ? 'Hello! I am your AI assistant. How can I help you today?'
        : `I received your message: "${chatInput}". This is a mock response.`
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 