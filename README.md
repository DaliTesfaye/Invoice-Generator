# Freelancer Invoice Generator

This is a fast, simple, and secure invoice generator designed for freelancers.
It follows the core principle: "Create → Preview → Generate → Done."

## Tech Stack
- Frontend: Next.js (TypeScript, Tailwind CSS, shadcn)
- Backend: Express (TypeScript, Node.js)
- Database: PostgreSQL with Prisma
- PDF Generation: Puppeteer

## Running Locally

### 1. Backend Setup
```bash
cd server
npm install
npx prisma generate
npm run dev # Ensure you have a script for this
```

### 2. Frontend Setup
```bash
cd web
npm install
npm run dev
```
