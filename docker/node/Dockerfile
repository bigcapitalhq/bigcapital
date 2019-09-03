FROM phusion/baseimage:0.9.19

RUN apt-get update &&\
    apt-get install -y npm &&\
    npm install -g n

ARG NODE_ENV=production
ARG NODE_VERSION=latest
ARG PROJECT_PATH=/opt/app/
ARG YARN=false

ENV YARN=$YARN
ENV PROJECT_PATH=$PROJECT_PATH
ENV NODE_ENV=$NODE_ENV

# Add
RUN groupadd -r www-app &&\
    useradd -r -g www-app www-app

RUN mkdir -p /home/www-app &&\
    chmod 777 /home/www-app -R

# Install the specified NODE_VERSION or grab latest
RUN n "$NODE_VERSION"

# Install Yarn
RUN if [ ${YARN} = true ]; then \
    npm install -g yarn \
;fi

COPY scripts/run-nodock.sh /usr/bin/run-nodock

RUN chmod 700 /usr/bin/run-nodock

RUN npm install webpack -g 
RUN npm install knex -g

WORKDIR /opt/app
