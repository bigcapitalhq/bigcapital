FROM node:14.15.0 as build

USER root

WORKDIR /app

COPY package.json ./
# COPY package-lock.json ./
COPY lerna.json ./

COPY ./packages/webapp/package.json ./packages/webapp
# COPY ./packages/webapp/package-lock.json ./packages/webapp

RUN npx lerna bootstrap --hoist --ignore-scripts -- --production --no-optional

COPY . .
RUN npm run build:webapp

# FROM nginx

# COPY ./packages/webapp/nginx/sites/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/packages/webapp/build /usr/share/nginx/html
