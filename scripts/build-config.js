const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Function to update config file with environment variable
function updateConfigFile(configPath, placeholder, envVar) {
    if (!fs.existsSync(configPath)) {
        console.log(`Config file not found: ${configPath}`);
        return;
    }
    
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Replace the placeholder with the actual environment variable
    if (configContent.includes(placeholder)) {
        configContent = configContent.replace(
            placeholder,
            `'${process.env[envVar] || ''}'`
        );
        
        // Write the modified config file
        fs.writeFileSync(configPath, configContent);
        console.log(`Updated ${configPath} with ${envVar}`);
    } else {
        console.log(`Placeholder ${placeholder} not found in ${configPath}`);
    }
}

// Update BoonFay config
updateConfigFile(
    path.join(__dirname, '../demos/BoonFay/config.js'),
    '__FITNESS_SURVEY_WEBHOOK_URL__',
    'FitnessSurveyWebhookURL'
);

// Update FitnessSurvey config
updateConfigFile(
    path.join(__dirname, '../demos/FitnessSurvey/config.js'),
    '__FITNESS_SURVEY_WEBHOOK_URL__',
    'FitnessSurveyWebhookURL'
);

console.log('Configuration built successfully!'); 