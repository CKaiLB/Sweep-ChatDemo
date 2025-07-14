const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/demos', express.static('demos'));

// Demo access configurations (in production, access codes would come from .env)
const DEMO_ACCESS_CONFIG = {
    'isanti': {
        accessCode: process.env.ISANTI_DEMO_CODE,
        redirectUrl: '/demos/IsantiDemo/index.html',
        webhookurl: process.env.IsantiWebhookURL
    },
    'BoonFay': {
        accessCode: process.env.BOONFAY_DEMO_CODE,
        redirectUrl: '/demos/BoonFay/index.html',
        webhookurl: process.env.BoonFayWebhookURL, // Fixed environment variable name
        surveryurl: process.env.FitnessSurveyWebhookURL
    },
    'FitnessSurvey':{
        accessCode: process.env.FITNESS_SURVEY_DEMO_CODE,
        redirectUrl: '/demos/FitnessSurvey/index.html',
        webhookurl: process.env.FitnessSurveyWebhookURL, // Fixed environment variable name
    },
    'GYM': {
        accessCode: process.env.GYM_DEMO_CODE,
        redirectUrl: '/demos/GYM/index.html',
        webhookurl: process.env.GYMWebhookURL
    }
    // Add other demos here as needed
};

// Auth verification endpoint
app.post('/api/auth/verify', (req, res) => {
    const { code } = req.body; // Only need the code from the frontend

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
            break; // Found a match, no need to continue searching
        }
    }

    // Check if a matching demo configuration was found
    if (!demoConfig) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid access code'
        });
    }

    // In a real application, you would generate a secure, short-lived token here
    // and potentially store session information server-server side or in a secure cookie.
    // For this demo, we'll return a simple success and the redirect URL.
    return res.status(200).json({ 
        success: true, 
        message: 'Access granted',
        redirectUrl: demoConfig.redirectUrl,
        token: `demo_${demoType}_${Date.now()}`, // Example token
        webhook: demoConfig.webhookurl
    });
});

// Serve the marketplace page at root
// Add middleware to protect demo routes if needed for more robust auth

// Example middleware to protect a specific demo route
// app.use('/demos/IsantiDemo', (req, res, next) => {
//     // Check for valid token/session here
//     const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token
//     if (token && isValidDemoToken(token, 'isanti')) { // Implement isValidDemoToken
//         next();
//     } else {
//         res.status(403).send('Forbidden: Invalid or missing token');
//     }
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'demos/marketplace/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Demo configurations:');
    for (const demo in DEMO_ACCESS_CONFIG) {
        console.log(`- ${demo}: Code - ${DEMO_ACCESS_CONFIG[demo].accessCode}, Redirect - ${DEMO_ACCESS_CONFIG[demo].redirectUrl}`);
    }
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port by setting the PORT environment variable.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Dummy function for potential token validation (implement real logic in production)
// function isValidDemoToken(token, requiredDemo) {
//     // Basic check: token format is demo_[demoType]_[timestamp]
//     const parts = token.split('_');
//     if (parts.length === 3 && parts[0] === 'demo' && parts[1] === requiredDemo) {
//         // Add token expiration check and possibly server-side session lookup here
//         return true;
//     }
//     return false;
// } 