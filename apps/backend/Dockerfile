FROM node:20-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN yarn global add turbo

# Copy from parent directory to get the full monorepo
COPY ../../ .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
RUN yarn turbo build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 medusa
RUN adduser --system --uid 1001 medusa

# Ensure the medusa user owns the backend folder
RUN mkdir -p /app/apps/backend/static
RUN chown -R medusa:medusa /app/apps/backend

USER medusa
COPY --from=installer /app .

WORKDIR /app/apps/backend

RUN yarn db:migrate

CMD ["yarn", "start"]