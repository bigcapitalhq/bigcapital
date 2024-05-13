FROM node:18.16.0-alpine as build

USER root

WORKDIR /app

# Copy application dependency manifests to the container image.
COPY ./package*.json ./
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./lerna.json ./lerna.json
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./packages/webapp/package*.json ./packages/webapp/

# Install application dependencies
RUN apk update
RUN apk add python3 build-base chromium

# Set PYHTON env
ENV PYTHON=/usr/bin/python3

# Install pnpm packages dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build webapp package
COPY ./packages/webapp /app/packages/webapp
RUN pnpm run build:webapp

FROM nginx

COPY ./packages/webapp/nginx/sites/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/webapp/build /usr/share/nginx/html
