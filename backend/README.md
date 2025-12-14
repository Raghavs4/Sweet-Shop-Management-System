# Sweet Shop Backend API

## Setup Instructions

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create a `.env` file based on `.env.example` and update the values:
\`\`\`env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Sweets (Protected)
- POST `/api/sweets` - Add a new sweet (Admin only)
- GET `/api/sweets` - Get all sweets
- GET `/api/sweets/search` - Search sweets by name, category, or price range
- PUT `/api/sweets/:id` - Update a sweet (Admin only)
- DELETE `/api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected)
- POST `/api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
- POST `/api/sweets/:id/restock` - Restock a sweet (Admin only)
