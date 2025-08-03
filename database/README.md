# Database Usage Guide

This project is responsible for implementing the Repository interfaces defined in the Application layer and accessing the database using Prisma and PostgreSQL.

---

## Quick Start

### 1. Start Local PostgreSQL (with Pgweb UI)

A `docker-compose.postgres.yml` is provided for quick startup:

```sh
docker compose -f docker-compose.postgres.yml up
```

- PostgreSQL service is at `localhost:5432` (user: `developer`, password: `dev_password`, database: `ca_dev_db`)
- Pgweb UI management interface: [http://localhost:8081](http://localhost:8081)

### 2. Configure Database Connection

Copy `.env.example` to `.env` and adjust the content as needed:

```env
DATABASE_URL="postgresql://developer:dev_password@localhost:5432/ca_dev_db?schema=public"
```

### 3. Initialize Database Schema

Run the following command to apply the initial migration:

```sh
npm run db:init
```

### 4. Generate Prisma Client

Run the following command to generate Prisma Client:

```sh
npm run db:generate
```

---

## Development Commands

- Open Prisma Studio to manage the database:
  ```sh
  npm run db:studio
  ```
- When the schema is modified, run migration:
  ```sh
  npm run db:migrate
  ```

---

## Repository Implementation Example

The infrastructure layer provides implementations of the Repository interfaces defined in the Application layer and integrates with Prisma/PostgreSQL.

```typescript
import { prisma } from '@ca/database';
import { PrismaUsersRepository } from '@ca/database';

const userRepository = new PrismaUsersRepository(prisma);
// Now you can use userRepository in your use case
```
