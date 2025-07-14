import { VercelRequest, VercelResponse } from '@vercel/node';

export function withAuth(handler) {
    return async (req, res) => {
        // Skip auth for the marketplace page
        if (req.url === '/demos/marketplace') {
            return handler(req, res);
        }

        // Check for demo access token in cookies
        const demoToken = req.cookies?.demoToken;
        const demoId = req.url.split('/')[2]; // Extract demo ID from URL

        if (!demoToken || !demoId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        // Verify the token (you can implement your own token verification logic)
        try {
            // Add your token verification logic here
            // For now, we'll just check if the token exists
            if (demoToken) {
                return handler(req, res);
            }
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    };
} 