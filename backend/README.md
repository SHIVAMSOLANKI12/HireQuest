# Game-Based Hiring Assessment Platform - Backend

Production-ready Node.js & Express.js backend project architecture for the Game-Based Hiring Assessment Platform.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Authentication**: JWT (Sprint 2+)
- **Validation**: Zod
- **Mailer**: Nodemailer

## Project Structure

```
backend/
├── src/
│   ├── config/          # Environment & service configurations
│   ├── constants/       # Global constants & enums
│   ├── middleware/      # Custom middleware (error handling, auth, validation)
│   ├── utils/           # Utility functions & helpers
│   ├── validators/      # Zod validation schemas
│   ├── modules/         # Modular feature domain layers
│   └── routes/          # API route definitions
├── prisma/              # Prisma schema & migration files
├── uploads/             # Static uploaded assets
├── tests/               # Automated test suites
├── docs/                # API and architectural documentation
├── server.js            # Server entry point
├── app.js               # Express application initialization
├── package.json         # Dependencies and scripts
└── .env.example         # Environment template
```

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Run in production mode**:
   ```bash
   npm start
   ```
