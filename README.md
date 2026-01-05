# Node/Express App with Neon Database (Neon Local + Neon Cloud)

This project is dockerized to use:

- **Neon Local** via Docker for development (ephemeral branches)
- **Neon Cloud** (serverless Postgres) for production

The Express app reads the database connection string from the `DATABASE_URL` environment variable in all environments.

---

## Prerequisites

- Docker and Docker Compose
- A Neon project, with:
  - Neon API key
  - Neon project ID
  - A parent branch ID for dev/testing (used for ephemeral branches)

---

## Environment Files

### Development: `.env.development`

Create `.env.development` in the project root (already scaffolded):

```bash
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here
PARENT_BRANCH_ID=your_parent_branch_id_here

NEON_LOCAL_DB=appdb
DATABASE_URL=postgres://neon:npg@neon-local:5432/appdb?sslmode=require

NODE_ENV=development
PORT=3000
```

This configures Neon Local to create an **ephemeral branch** from `PARENT_BRANCH_ID` on container start and delete it on stop. The Express app connects to Neon Local at `postgres://neon:npg@neon-local:5432/appdb`.

### Production (local prod-style testing): `.env.production`

Create `.env.production` in the project root (already scaffolded):

```bash
DATABASE_URL=postgres://<user>:<password>@<your-project>.neon.tech/<db_name>?sslmode=require
NODE_ENV=production
PORT=3000
```

In real production, set these values via your cloud provider/CI secret manager instead of using a file.

---

## Dockerfile

The `Dockerfile` builds a production-ready Node/Express image and runs `npm start`:

```dockerfile
FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
```

Ensure your `package.json` defines `"start": "node index.js"` (or similar) so `npm start` launches your Express server.

---

## Development: Run with Neon Local

1. Make sure `.env.development` is filled with real Neon credentials.
2. Start the development stack:

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

   This will:

   - Start the `neon-local` service, which connects to your Neon project and creates an **ephemeral branch** from `PARENT_BRANCH_ID`.
   - Start the `app` service, which reads `DATABASE_URL` from `.env.development` and connects to `postgres://neon:npg@neon-local:5432/appdb`.

3. Access the app at:

   - `http://localhost:3000`

4. Stop the stack and delete the ephemeral branch:

   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

---

## Production: Run Against Neon Cloud

### Local prod-style run

1. Fill `.env.production` with your real Neon Cloud `DATABASE_URL`.
2. Run:

   ```bash
   docker compose -f docker-compose.prod.yml up --build
   ```

   - Only the `app` service runs.
   - The app connects directly to Neon Cloud at the `...neon.tech...` URL.

3. Stop:

   ```bash
   docker compose -f docker-compose.prod.yml down
   ```

### Real production deployment

1. Build and push the image:

   ```bash
   docker build -t your-registry/your-express-app:latest .
   docker push your-registry/your-express-app:latest
   ```

2. In your deployment platform (Kubernetes, ECS, etc.):

   - Deploy `your-registry/your-express-app:latest`.
   - Set environment variables:
     - `DATABASE_URL=postgres://<user>:<password>@<your-project>.neon.tech/<db_name>?sslmode=require`
     - `NODE_ENV=production`
     - `PORT=3000`

No Neon Local proxy is used in production; the Express app connects directly to Neon Cloud.
