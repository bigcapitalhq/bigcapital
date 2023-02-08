FROM node:14.15.0 as build

USER root

WORKDIR /app

# Install dependencies
COPY package.json ./
COPY lerna.json ./

COPY ./packages/webapp/package.json /app/packages/webapp/package.json

RUN npm install
RUN npm run bootstrap

# Build webapp package
COPY ./packages/webapp /app/packages/webapp
RUN npm run build:webapp

# FROM nginx
COPY ./packages/webapp/nginx/sites/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./packages/webapp/build /usr/share/nginx/html
