# SweepAI Demo Marketplace

A collection of AI-powered chat demos showcasing different features and integrations of the SweepAI platform.

## Structure

```
.
├── api/                    # API endpoints and middleware
│   ├── auth/              # Authentication related endpoints
│   ├── middleware/        # Request middleware
│   └── webhook/           # Webhook handlers
├── demos/                 # Demo pages
│   ├── marketplace/       # Main marketplace landing page
│   ├── basic/            # Basic chat demo
│   └── advanced/         # Advanced integration demo
├── public/               # Static assets
│   └── images/          # Images and logos
└── vercel.json          # Vercel deployment configuration
```

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your demo access codes
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run locally:
   ```bash
   vercel dev
   ```

## Adding New Demos

1. Create a new directory in `demos/` for your demo
2. Add your demo files (HTML, JS, CSS)
3. Add a new access code in your `.env` file
4. Add a new card in `demos/marketplace/index.html`
5. Update `vercel.json` if needed

## Environment Variables

Required environment variables:
- `BASIC_DEMO_CODE`: Access code for the basic demo
- `ADVANCED_DEMO_CODE`: Access code for the advanced demo
- Add more demo codes as needed

## Deployment

The project is configured for deployment on Vercel. Push to your repository to trigger automatic deployments.

## Security

- Each demo is protected by a unique access code
- Access codes should be kept secure and shared only with authorized users
- Environment variables are encrypted in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 