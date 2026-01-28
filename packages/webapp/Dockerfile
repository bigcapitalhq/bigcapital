# Stage 1: Build
FROM node:18.16.0-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.10.2

# Install build dependencies
RUN apk add --no-cache python3 build-base chromium

# Set Python environment
ENV PYTHON=/usr/bin/python3

# Copy package files for dependency installation
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml lerna.json ./
COPY --chown=node:node packages/webapp/package.json ./packages/webapp/
COPY --chown=node:node shared/bigcapital-utils/package.json ./shared/bigcapital-utils/
COPY --chown=node:node shared/pdf-templates/package.json ./shared/pdf-templates/
COPY --chown=node:node shared/email-components/package.json ./shared/email-components/

# Install all dependencies (including devDependencies for build)
RUN pnpm install

# Copy source code for webapp and dependencies
COPY --chown=node:node ./packages/webapp ./packages/webapp
COPY --chown=node:node ./shared/bigcapital-utils ./shared/bigcapital-utils
COPY --chown=node:node ./shared/pdf-templates ./shared/pdf-templates
COPY --chown=node:node ./shared/email-components ./shared/email-components

# Build webapp package
RUN pnpm run build:webapp

# Stage 2: Nginx
FROM nginx:alpine

# Copy nginx configuration
COPY --chown=root:root ./packages/webapp/nginx/sites/default.conf /etc/nginx/conf.d/default.conf

# Copy built webapp assets from builder stage
COPY --from=builder --chown=nginx:nginx /app/packages/webapp/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Nginx runs as nginx user by default, which is good for security
# No CMD needed as nginx base image already has it
