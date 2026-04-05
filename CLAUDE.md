# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HackStack is a competitive programming platform consisting of three main components:
1. **HackStack-server**: Turborepo monorepo with React + TypeScript frontend, Express backend, and webhook service
2. **hackstack-problems**: Problem definitions, test cases, and boilerplate code for coding challenges
3. **executor**: Spring Boot execution engine for running submitted code (in development)

**Tech Stack:**
- Frontend: React + TypeScript + Vite + TailwindCSS + Radix UI + Monaco Editor
- Backend: Express + TypeScript + Prisma (PostgreSQL) + JWT authentication
- Code Execution: Spring Boot executor (in development)
- Caching: Redis
- Event Streaming: Kafka
- Monorepo: Turborepo + pnpm workspaces

## Repository Structure

```
HackStack/
├── HackStack-server/    # Main monorepo application
├── hackstack-problems/  # Problem definitions and test cases
└── executor/           # Spring Boot execution engine (WIP)
```

## Development Commands

### HackStack-server (Main Application)

All commands should be run from `HackStack-server/` directory:

```bash
# Start all apps in development mode
pnpm dev

# Start only frontend and backend (exclude webhook)
pnpm web

# Start only backend
pnpm backend

# Build all apps and packages
pnpm build

# Lint all apps
pnpm lint

# Type check all apps
pnpm type-check

# Format code
pnpm format
```

### Database Management

```bash
# Generate Prisma client (run from HackStack-server/)
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Seed language data
pnpm prisma:seedLanguage
```

### Boilerplate Generator

```bash
# Navigate to boilerplate-generator
cd HackStack-server/apps/boilerplate-generator

# Generate boilerplate for a single problem
pnpm generate

# Generate boilerplate for all problems
pnpm generate-all
```

### Executor (Spring Boot)

```bash
# Navigate to executor directory
cd executor

# Run the application
./mvnw spring-boot:run

# Build the application
./mvnw clean package

# Run tests
./mvnw test
```

## HackStack-server Architecture

### Apps

- **web**: Vite-based React + TypeScript frontend with React Router, Monaco Editor for code editing, and Radix UI components
- **http-backend**: Express + TypeScript REST API handling authentication, problems, submissions, and users
- **submission-webhook**: Webhook endpoint that receives execution callbacks to update test case and submission statuses
- **boilerplate-generator**: Generates partial and full boilerplate code (Java/JS) from problem structure definitions in `hackstack-problems/`

### Shared Packages

- **@repo/db**: Prisma client and schema, database utilities
- **@repo/common-zod**: Shared Zod schemas for type validation
- **@repo/language**: Language configuration and mapping for supported programming languages
- **@repo/redis-client**: Redis client wrapper for caching
- **@repo/ui**: Shared React components
- **@repo/eslint-config**: Shared ESLint configuration
- **@repo/typescript-config**: Shared TypeScript configuration

### Key Data Models (Prisma)

- **User**: Authentication and user management with JWT-based auth (roles: ADMIN, USER)
- **Problem**: Coding problems with difficulty (EASY/MEDIUM/HARD), type tags (Array, String, HashTable, etc.), and visibility controls
- **DefaultCode**: Stores generated boilerplate per problem/language (FULLBOILERPLATECODE, PARTIALBOILERPLATECODE)
- **Submission**: Code submissions tracking status (PENDING → SUCCESS/REJECTED) and performance metrics
- **TestCase**: Individual test cases with status (ACCEPTED, WRONG_ANSWER, TLE, MLE, RUNTIME_ERROR, etc.)
- **Language**: Supported programming languages with file extensions and Monaco editor mappings
- **Contest / ContestProblem / ContestSubmission / ContestPoints**: Contest system with problems, submissions, leaderboard, and ranking
- **UserProblem**: Tracks user progress per problem (NOT_ATTEMPTED, ATTEMPTED, SOLVED)

### API Routes (http-backend)

- `/api/v1/auth/*`: Authentication endpoints (login, signup, logout, verify)
- `/api/v1/problem/*`: Problem CRUD and retrieval
- `/api/v1/submission/*`: Code submission and retrieval
- `/api/v1/user/*`: User profile and submission history

### Frontend Structure

- `src/pages/`: Route components (Index for problem list, Problem for code editor, Auth for login/signup)
- `src/components/`: Reusable UI components
- `src/context/AuthContext.tsx`: Authentication state management
- `src/lib/`: API client and utilities

### Submission Flow

1. User submits code via frontend
2. Backend creates Submission and TestCase records with PENDING status
3. Backend publishes code execution request to Kafka (code-executor topic)
4. Executor service consumes message, executes code, and publishes results to Kafka (code-results topic)
5. Webhook consumes results and updates TestCase status using tracking ID
6. After all test cases complete, webhook updates Submission status and UserProblem status

## hackstack-problems Structure

Contains problem definitions used by the boilerplate-generator to create code templates.

### Problem Directory Structure

```
problem-name/
├── Problem.md          # Problem statement and examples
├── Structure.md        # Input/output specifications
├── boilerplate/        # Basic function templates
│   ├── function.java
│   └── function.js
├── boilerplate-full/   # Complete function implementations
│   ├── function.java
│   └── function.js
└── tests/             # Test cases
    ├── inputs/        # Input files (0.txt to 99.txt)
    └── outputs/       # Expected output files (0.txt to 99.txt)
```

### Structure.md Format

Defines the function signature following this pattern:

```
Problem Name: "Your Problem Name"
Function Name: yourFunctionName
Input Structure:
Input Field: type name
Output Structure:
Output Field: type result
```

**Supported Types:**
- Java: int, long, float, double, boolean, char, String, int[], List<Integer>, List<String>, etc.
- JavaScript: number, boolean, string, arrays

See `hackstack-problems/Rules.md` for detailed guidelines.

## Executor Architecture

Spring Boot application for code execution (currently in development).

**Tech Stack:**
- Java
- Spring Boot
- PostgreSQL
- Lombok
- Maven

This component provides scalable code execution capabilities via Kafka message processing.

## Infrastructure Setup

### Docker Services

The platform requires Redis and Kafka services. Use these Docker commands:

```bash
# Redis (Alpine - smallest image)
docker run -d --name hackstack-redis -p 6379:6379 redis:alpine

# Kafka (KRaft mode, no Zookeeper needed)
docker run -d --name hackstack-kafka -p 9092:9092 apache/kafka
```

**Connection URLs:**
- Redis: `redis://localhost:6379`
- Kafka: `localhost:9092`

### Managing Kafka Topics

HackStack uses two Kafka topics:
- **code-executor**: Sends code execution requests from http-backend to executor
- **code-results**: Receives execution results in submission-webhook

```bash
# Access Kafka container
docker exec -it hackstack-kafka /bin/bash
cd /opt/kafka/bin

# Create required topics
./kafka-topics.sh --create --topic code-executor --bootstrap-server localhost:9092
./kafka-topics.sh --create --topic code-results --bootstrap-server localhost:9092

# List topics
./kafka-topics.sh --list --bootstrap-server localhost:9092

# Monitor code-executor topic (execution requests)
./kafka-console-consumer.sh --topic code-executor --from-beginning --bootstrap-server localhost:9092

# Monitor code-results topic (execution results)
./kafka-console-consumer.sh --topic code-results --from-beginning --bootstrap-server localhost:9092
```

## Environment Configuration

### Required Environment Variables

Each app requires its own `.env` file:

**http-backend:**
- `NODE_ENV`: development/production
- `PORT`: Backend server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection (redis://localhost:6379)
- `KAFKA_BROKER`: Kafka broker address (localhost:9092)
- `KAFKA_CLIENT_ID`: Client identifier for Kafka
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_COOKIE_EXPIRES_IN`: Cookie expiration in milliseconds
- `JWT_EXPIRES_IN`: JWT token expiration (e.g., 7d)
- `JWT_SALT_ROUNDS`: bcrypt salt rounds
- `FRONTEND_URL`: Frontend URL for CORS (http://localhost:5173)

**submission-webhook:**
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Webhook server port

**web:**
- `VITE_API_URL`: Backend API URL

**@repo/db (packages/db):**
- `DATABASE_URL`: PostgreSQL connection string

### Database Seeding

```bash
# Seed language data
pnpm prisma:seedLanguage

# Seed problem data
pnpm prisma:seedProblem
```

## Important Notes

- **Package Management**: Always use `pnpm` for HackStack-server (specified in package.json packageManager)
- **Monorepo**: Uses Turborepo for task orchestration and caching with TUI (terminal UI) mode
- **Shared Packages**: Located in `packages/common/` for language and zod schemas, root `packages/` for others
- **Database**: PostgreSQL required, configure via `DATABASE_URL` in multiple .env files
- **Redis & Kafka**: Both required for operation (Redis for caching, Kafka for event streaming)
- **Webhook Service**: Receives execution callbacks from executor service via Kafka to update submission statuses
- **Boilerplate Generator**: Expects problem definitions in `../hackstack-problems` directory relative to HackStack-server
- **TypeScript**: Full TypeScript support across frontend and backend with shared type definitions
- **Executor**: Java required, uses Maven wrapper (mvnw), currently in development phase
