FROM node:14.15.0 as build

USER root

ARG WEB_REVERSE_PROXY_PORT=8000
ARG WEB_SSL=false
ARG SELF_SIGNED=false
ARG NO_DEFAULT=false
ARG REACT_APP_SERVICES_HOST=/services/m

ENV WEB_REVERSE_PROXY_PORT=$WEB_REVERSE_PROXY_PORT
ENV WEB_SSL=$WEB_SSL
ENV SELF_SIGNED=$SELF_SIGNED
ENV NO_DEFAULT=$NO_DEFAULT

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY nginx/sites /etc/nginx/templates
COPY ./nginx/scripts /root/scripts/
COPY nginx/certs /etc/ssl/
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN /bin/bash /root/scripts/nginx-build.sh

COPY ./build /usr/share/nginx/html
