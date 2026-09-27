# Stage 1: Build
FROM node:18.16.0-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.15.9

# Install build dependencies
RUN apk add --no-cache python3 build-base chromium

# Set Python environment
ENV PYTHON=/usr/bin/python3

# Copy package files for dependency installation
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml lerna.json ./
COPY --chown=node:node packages/server/package.json ./packages/server/
COPY --chown=node:node shared ./shared

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --chown=node:node ./packages/server ./packages/server

# Build NestJS application
RUN pnpm run build:server --skip-nx-cache

# Stage 2: Production
FROM node:18.16.0-alpine AS production

WORKDIR /app

# Install pnpm for production. husky is global so the root `prepare` script
# resolves without installing it into the workspace — see the install step.
RUN npm install -g pnpm@9.15.9 husky@8

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install build dependencies for native modules (bcrypt, etc.)
RUN apk add --no-cache python3 build-base

# Set Python environment
ENV PYTHON=/usr/bin/python3

# Copy package files for production dependency installation
COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=nodejs:nodejs packages/server/package.json ./packages/server/
COPY --chown=nodejs:nodejs shared ./shared

# Copy .husky directory (needed for husky install command)
COPY --chown=nodejs:nodejs .husky ./.husky

# Install only production dependencies.
#
# Do NOT wrap this in `pnpm add -D -w husky` / `pnpm remove -w husky`. Under
# pnpm 9.15.9 the `add -w` scopes the following install to the root project and
# leaves packages/server/node_modules empty, so the image builds green and then
# dies at runtime with MODULE_NOT_FOUND on nest-commander. pnpm 9.0.5 did not
# do this. husky is installed globally above instead, which is all the root
# `prepare` script needs; with no .git present it skips and exits 0.
RUN pnpm install --prod --frozen-lockfile && \
    # Remove build dependencies to reduce image size
    apk del python3 build-base

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/packages/server/dist ./packages/server/dist

# Copy static assets (i18n, public, static directories)
COPY --from=builder --chown=nodejs:nodejs /app/packages/server/src/i18n ./packages/server/dist/i18n
COPY --from=builder --chown=nodejs:nodejs /app/packages/server/public ./packages/server/public
COPY --from=builder --chown=nodejs:nodejs /app/packages/server/static ./packages/server/static

# Copy database migration files (needed for running migrations)
COPY --from=builder --chown=nodejs:nodejs /app/packages/server/src/database ./packages/server/src/database

# Copy all shared packages from builder so newly added shared packages are included automatically
COPY --from=builder --chown=nodejs:nodejs /app/shared ./shared

# Set runtime environment variables (these should be provided at runtime via docker-compose or k8s)
ENV NODE_ENV=production
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV PORT=3000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check - uses /api/system_db ping endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/system_db', (r) => {process.exit(r.statusCode >= 200 && r.statusCode < 300 ? 0 : 1)}).on('error', () => process.exit(1))"

# Start the application
CMD [ "node", "packages/server/dist/main.js" ]
