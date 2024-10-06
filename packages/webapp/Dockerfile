FROM node:18.16.0-alpine as build

USER root

WORKDIR /app

# Copy application dependency manifests to the container image.
COPY . .

# Install application dependencies
RUN apk update
RUN apk add python3 build-base chromium

# Set PYHTON env
ENV PYTHON=/usr/bin/python3

# Install pnpm packages dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build webapp package
RUN pnpm run build:webapp

FROM nginx

COPY ./packages/webapp/nginx/sites/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/webapp/build /usr/share/nginx/html
