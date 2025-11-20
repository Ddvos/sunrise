# -------- Base image with pnpm enabled --------
FROM node:22-alpine AS base

# Create app directory
WORKDIR /app

# Enable corepack so we can use pnpm
# (corepack is included with Node 22)
RUN corepack enable

# -------- Build stage --------
FROM base AS build

# Copy only dependency files first (better caching)
COPY package.json pnpm-lock.yaml ./
# If you have this file (monorepo), uncomment:
# COPY pnpm-workspace.yaml ./

# Install deps (using lockfile for reproducible builds)
RUN pnpm install --frozen-lockfile

# Now copy the rest of the project
COPY . .

# Build the Svelte app
RUN pnpm run build

# -------- Production (runtime) stage --------
FROM base AS production

WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to install prod deps
COPY package.json pnpm-lock.yaml ./
# COPY pnpm-workspace.yaml ./   # if you use it

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built app from build stage
COPY --from=build /app/build ./build

# Port SvelteKit adapter-node will listen on
ENV PORT=4173
EXPOSE 4173

# Start the SvelteKit server
CMD ["node", "build"]
