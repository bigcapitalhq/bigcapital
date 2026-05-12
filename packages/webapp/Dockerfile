# Stage 1: Build
FROM node:18.16.0-alpine AS builder

WORKDIR /app

ARG GIT_SHA=unknown
ENV VITE_GIT_SHA=$GIT_SHA

# Install pnpm
RUN npm install -g pnpm@9.0.5

# Install build dependencies
RUN apk add --no-cache python3 build-base chromium

# Set Python environment
ENV PYTHON=/usr/bin/python3

# Copy package files for dependency installation
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml lerna.json ./
COPY --chown=node:node packages/webapp/package.json ./packages/webapp/
COPY --chown=node:node shared ./shared

# Install all dependencies (including devDependencies for build)
RUN pnpm install

# Copy source code for webapp and dependencies
COPY --chown=node:node ./packages/webapp ./packages/webapp

# Build webapp package — cap Node heap to leave room for the OS and pnpm overhead
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build:webapp

# Stage 2: Nginx
FROM nginx:alpine

ARG GIT_SHA=unknown
LABEL org.opencontainers.image.revision=$GIT_SHA

# Copy nginx configuration
COPY --chown=root:root ./packages/webapp/nginx/sites/default.conf /etc/nginx/conf.d/default.conf

# Copy built webapp assets from builder stage
COPY --from=builder --chown=nginx:nginx /app/packages/webapp/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Nginx runs as nginx user by default, which is good for security
# No CMD needed as nginx base image already has it
