FROM node:20-alpine AS base

FROM base AS builder
# Install dependencies for building
RUN apk update && apk add --no-cache libc6-compat python3 make g++

WORKDIR /app
RUN yarn global add turbo

# Copy root package files and workspace configuration
COPY package.json yarn.lock turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages ./packages

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY apps/backend ./apps/backend

# Build only the backend
RUN yarn turbo build --filter=api

FROM base AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk update && apk add --no-cache curl

# Create medusa user
RUN addgroup --system --gid 1001 medusa && \
    adduser --system --uid 1001 --ingroup medusa medusa

# Create necessary directories
RUN mkdir -p /app/apps/backend/static && \
    chown -R medusa:medusa /app

# Copy built application
COPY --from=builder --chown=medusa:medusa /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder --chown=medusa:medusa /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder --chown=medusa:medusa /app/apps/backend/medusa-config.ts ./apps/backend/medusa-config.ts
COPY --from=builder --chown=medusa:medusa /app/apps/backend/src ./apps/backend/src
COPY --from=builder --chown=medusa:medusa /app/node_modules ./node_modules
COPY --from=builder --chown=medusa:medusa /app/apps/backend/node_modules ./apps/backend/node_modules

# Switch to medusa user
USER medusa

WORKDIR /app/apps/backend

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:9000/health || exit 1

# Start the application
CMD ["sh", "-c", "yarn db:migrate && yarn start"]