FROM node:20-alpine AS base

# Install dependencies
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install turbo globally
RUN yarn global add turbo

# Copy package files
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY packages ./packages
COPY turbo.json ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the backend
RUN yarn turbo build --filter=api

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Create user
RUN addgroup --system --gid 1001 medusa
RUN adduser --system --uid 1001 medusa

# Copy built application
COPY --from=base --chown=medusa:medusa /app ./

USER medusa

# Set working directory to backend
WORKDIR /app/apps/backend

# Run migrations and start
RUN yarn db:migrate
CMD ["yarn", "start"]