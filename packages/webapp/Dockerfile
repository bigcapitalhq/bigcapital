FROM node:16-alpine as build

USER root

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY lerna.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

COPY ./packages/webapp/package*.json /app/packages/webapp/

RUN apk update 
RUN apk add python3 build-base chromium
ENV PYTHON=/usr/bin/python3

RUN npm install -g pnpm
RUN pnpm install
# RUN npm run bootstrap

# Build webapp package
COPY ./packages/webapp /app/packages/webapp
RUN npm run build:webapp

FROM nginx

COPY ./packages/webapp/nginx/sites/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/webapp/build /usr/share/nginx/html
