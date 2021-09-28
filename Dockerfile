FROM node:14.15.0 as build

USER root

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./.npmrc /app/.npmrc

ARG GITHUB_USERNAME=
ARG GITHUB_PASS=
ARG GITHUB_EMAIL=

RUN ${GITHUB_USERNAME}\n${GITHUB_PASS}\n${GITHUB_EMAIL}" | npm login --registry=https://npm.pkg.github.com

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY ./nginx/sites/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html
