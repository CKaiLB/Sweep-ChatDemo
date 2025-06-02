# SweepAI Demo Site

A modern, futuristic demo site showcasing the SweepAI chat widget capabilities.

## Local Development

1. Clone the repository
2. Open `demo.html` in your browser
3. Make sure the backend server is running at `http://localhost:5678`

## Deployment

This project is configured for deployment on Vercel.

### Deploying to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the project:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

## Environment Variables

Make sure to set up the following environment variables in your Vercel project settings:
- `WEBHOOK_URL`: Your backend webhook URL
- `CHATBASE_ID`: Your Chatbase widget ID

## Project Structure

- `demo.html` - Main demo page
- `demo.js` - Chat widget implementation
- `vercel.json` - Vercel deployment configuration 