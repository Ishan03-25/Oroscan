# Oroscan Admin Panel

A Next.js-based admin panel for managing the Oroscan oral cancer screening platform.

## Features

- **Dashboard**: View statistics and recent patient screenings
- **Patient Management**: Browse, search, and view detailed patient records
- **Medical Records**: Access complete patient history including:
  - Medical history responses
  - Family history
  - Symptoms and features
  - Medical images
  - AI/ML diagnosis results
- **Reports**: Generate screening reports (coming soon)
- **Settings**: Configure application settings (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Access to the Oroscan database (PostgreSQL)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
Create a `.env` file with:
```
DATABASE_URL="your-postgresql-connection-string"
```

3. Run the development server:
```bash
pnpm dev
```

The admin panel will be available at [http://localhost:3001](http://localhost:3001)

## Project Structure

```
adminPanel/
├── app/
│   ├── dashboard/          # Dashboard page
│   ├── patients/           # Patient management
│   │   └── [id]/          # Patient details
│   ├── reports/           # Reports page
│   ├── settings/          # Settings page
│   └── api/               # API routes
├── lib/                   # Utilities and database client
└── public/                # Static assets
```

## Technology Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Prisma)
- **Icons**: Lucide React

## Database Connection

The admin panel connects to the same database as the main Oroscan application using Prisma. It shares the generated Prisma client from the parent directory.

## Development

- Dev server runs on port 3001 to avoid conflicts with the main app (port 3000)
- Hot reload enabled for fast development
- TypeScript for type safety

## Deployment

Build for production:
```bash
pnpm build
pnpm start
```

## License

Private - Part of the Oroscan platform
