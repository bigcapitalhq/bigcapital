FROM node:14.15.0 as build

USER root

ARG WEB_REVERSE_PROXY_PORT=8000
ARG NO_DEFAULT=false
ARG REACT_APP_SERVICES_HOST=/services/m

ENV WEB_REVERSE_PROXY_PORT=$WEB_REVERSE_PROXY_PORT
ENV NO_DEFAULT=$NO_DEFAULT

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY ./nginx/sites/default.conf /etc/nginx/conf.d/default.conf

RUN /bin/bash /root/scripts/nginx-build.sh

COPY --from=build /app/build /usr/share/nginx/html
