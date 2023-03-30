FROM node:14.20-alpine as build

USER root
RUN apk update && \
  apk upgrade && \
  apk add git

RUN apk add --no-cache bash

ARG DB_HOST= \
  DB_USER= \
  DB_PASSWORD= \
  DB_CHARSET= \
  # System database.
  SYSTEM_DB_NAME= \
  SYSTEM_DB_PASSWORD= \
  SYSTEM_DB_USER= \
  SYSTEM_DB_HOST= \
  SYSTEM_DB_CHARSET=

ENV DB_HOST=$DB_HOST \
  DB_USER=$DB_USER \
  DB_PASSWORD=$DB_PASSWORD \
  DB_CHARSET=$DB_CHARSET \
  # System database.
  SYSTEM_DB_HOST=$SYSTEM_DB_HOST \
  SYSTEM_DB_USER=$SYSTEM_DB_USER \
  SYSTEM_DB_PASSWORD=$SYSTEM_DB_PASSWORD \
  SYSTEM_DB_NAME=$SYSTEM_DB_NAME \
  SYSTEM_DB_CHARSET=$SYSTEM_DB_CHARSET

# Create app directory.
WORKDIR /app

RUN chown node:node /

# Copy application dependency manifests to the container image.
COPY ./package*.json ./
COPY ./packages/server/package*.json ./packages/server/

COPY ./lerna.json ./lerna.json

# Install app dependencies for production.
RUN npm install
RUN npm run bootstrap

COPY --chown=node:node ./packages/server ./packages/server

# Build the server package.
RUN npm run build:server

# Change working dir to the server package.
WORKDIR /app/packages/server
RUN git clone https://github.com/vishnubob/wait-for-it.git

# Once we listen the mysql port run the migration task.
CMD ["./wait-for-it/wait-for-it.sh", "mysql:3306", "--", "node", "./build/commands.js", "system:migrate:latest"]