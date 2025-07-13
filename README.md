# Student Budget App

Student Budget App is a modern budgeting dashboard that allows users to manage budgets, track expenses, and visualize financial data efficiently.  
It is built using Next.js, Prisma, NextAuth, Tailwind CSS, and deployed on Vercel.

## Features

- Interactive financial dashboard
- User authentication with NextAuth (Credentials provider)
- Monthly budget management
- Add, edit, delete expenses
- Visual charts for categories and daily spending
- Responsive, clean UI styled with Tailwind CSS
- Deployed on Vercel for fast, reliable hosting

## Tech Stack

- Next.js
- NextAuth.js
- Prisma ORM
- PostgreSQL (Railway)
- Tailwind CSS
- Vercel

# Set-Up and Deployment

## Clone the repository

git clone https://github.com/yourusername/student-budget-app.git
cd student-budget-app

### Install dependencies

npm install

## Configure environment variables

Create a .env.local file in the project root:

DATABASE_URL=your_postgresql_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

## Run database migrations and start server

npx prisma migrate dev
npm run dev

Visit http://localhost:3000 to view the application locally.

## Deployment

The app is deployed using Vercel.

Ensure the following environment variables are set in your Vercel project settings:

DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL (e.g. https://your-vercel-project.vercel.app)

Prisma requires generation of its client during build. The postinstall script ensures this happens properly:
"postinstall": "prisma generate"

## Project Structure

├── prisma/             # Prisma schema and migrations
├── public/             # Static assets including logo
├── src/
│   ├── pages/          # Next.js pages (dashboard, login, API routes)
│   ├── components/     # Reusable UI components
│   └── styles/         # Global styles
├── .env.local          # Environment variables for local development
├── package.json        # Project configuration and scripts
└── README.md           # Project documentation

## License

This project is open-source and available under the MIT License.

## Acknowledgements

Next.js
NextAuth.js
Prisma
Railway
Tailwind CSS
Vercel
