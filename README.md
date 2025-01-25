# Next.js Docker Starter

A development environment for Next.js applications with PostgreSQL, MongoDB, Redis, LocalStack (S3), and MailHog.

## Prerequisites

- Docker Desktop for Mac (Apple Silicon)
- Node.js 20+

## Services

- Next.js: http://localhost:3000
- PostgreSQL: localhost:5432
- PgAdmin: http://localhost:5050
- MongoDB: localhost:27017
- Mongo Express: http://localhost:8081
- Redis: localhost:6379
- Redis Commander: http://localhost:8082
- LocalStack (S3): http://localhost:4566
- MailHog: http://localhost:8025 (SMTP: localhost:1025)

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Run `docker compose up -d`

## Development

Your Next.js application code goes in the root directory. The development server will auto-reload on changes.