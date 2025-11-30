# FloodAid

A donation management system for flood relief efforts in Sri Lanka, with full Sinhala language support.

## Features

- 🔐 User authentication with roles (Donor & Collector)
- 📝 Donation listing with pagination (15 per page)
- ✏️ Edit donations (owners only)
- ✅ Collect donations (collectors only)
- 🇱🇰 Full Sinhala language interface
- 🎨 Clean list view design

## Tech Stack

**Frontend:**
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend:**
- Node.js
- Express
- MongoDB
- JWT Authentication
- Multer (file uploads)

## Setup

### Prerequisites
- Node.js 18+
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/FloodAid.git
cd FloodAid
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Configure environment variables

**Server (.env):**
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**Client (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the application
```bash
# Run server (from server directory)
npm run dev

# Run client (from client directory)
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
FloodAid/
├── client/          # Next.js frontend
│   ├── src/
│   │   ├── app/     # Pages
│   │   ├── components/  # UI components
│   │   ├── lib/     # API and utilities
│   │   └── types/   # TypeScript types
│   └── package.json
│
└── server/          # Express backend
    ├── src/
    │   ├── models/  # MongoDB models
    │   ├── routes/  # API routes
    │   ├── middleware/  # Auth middleware
    │   └── config/  # Configuration
    └── package.json
```

## License

MIT
# floodAid
# floodAid
