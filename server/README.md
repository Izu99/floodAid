# FloodAid Server

Node.js backend server for the FloodAid application - helping people during flood emergencies.

## Technologies
- **Node.js** with **Express**
- **TypeScript** for type safety
- **CORS** enabled for frontend communication
- **dotenv** for environment configuration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Server will run on http://localhost:5000

## Available Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
