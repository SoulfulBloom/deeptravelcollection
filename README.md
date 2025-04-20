# Deep Travel Collections

An AI-powered premium travel platform for Canadian snowbirds, offering intelligent and personalized travel planning solutions with advanced recommendation capabilities.

## Key Technologies

- React.js with TypeScript
- Drizzle ORM for PostgreSQL integration
- OpenAI-powered recommendation engine
- Stripe payment integration
- Comprehensive deployment and server management infrastructure
- Responsive, mobile-first design with enhanced user interaction

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env` file:
   ```
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. For production build:
   ```
   npm run build
   npm run start
   ```

## Project Structure

- `client/src` - React frontend application
- `server` - Express backend server
- `shared` - Shared types and utilities
- `public` - Static assets

## Database

PostgreSQL database with Drizzle ORM. Run migrations with:
```
npm run db:push
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.
