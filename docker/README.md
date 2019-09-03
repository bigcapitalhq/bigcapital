![NoDock](https://raw.githubusercontent.com/Osedea/nodock/master/docs/images/logo.png)

Docker Compose for Node projects with Node, MySQL, MongoDB, NGINX, Memcached, Redis, Certbot and RabbitMQ images

![Node + Docker](https://raw.githubusercontent.com/Osedea/nodock/master/docs/images/nodock.jpg)

<a name="why-nodock"></a>
## Why NoDock?

The [docker Node.js](https://github.com/nodejs/docker-node) image is very simple, you give it an entrypoint and it runs it. This is fine for very simple/small scripts but for larger projects you'll probably want something a bit more robust.

The goal of NoDock is to provide a complete environment for your node project: Node.js service(s), databases, web servers, queues, etc. while doing the "wiring" for you.

You can use NoDock for simple projects by using one of the [examples](#Examples) or you can build upon them.

## Contents

- [Requirements](#Requirements)
- [Installation](#Installation)
- [Usage](#Usage)
- [Examples](#Examples)
- [Workspace](#Workspace)
- [HTTPS](#HTTPS)
    - [Self-signed certificates](#SelfSigned)
    - [Certbot](#Certbot)
- [Non-web project](#Non-Web)
- [Multiple Node containers](#Multi-Node)
- [More options](#More-Options)
    - [Use Yarn](#Use-Yarn)
    - [Change Node entrypoint](#Node-Entrypoint)
    - [Change Node environment](#Node-Environment)
    - [Change Node version](#Node-Version)
    - [Change Node project location](#Node-Project-Path)
    - [Change MySQL database/user/password](#MySQL-Database-User)
    - [Change PostgreSQL database/user/password](#PostgreSQL-Database-User)
    - [Change NGINX reverse proxy port](#NGINX-Reverse-Proxy-Port)
    - [Change the timezone](#Change-the-timezone)
    - [Use RabbitMQ plugins](#Use-RabbitMQ-plugins)
    - [Change the RabbitMQ user/password](#Change-RabbitMQ-User)
    - [Modify Redis config](#Modify-Redis-Config)
- [Contributing](#Contributing)
- [License](#License)
- [Credits](#credits)

<a name="Requirements"></a>
## Requirements

* [Docker Engine 17.06+](https://docs.docker.com/engine/installation/)
* [Docker Compose 1.8+](https://docs.docker.com/compose/install/)

<a name="Installation"></a>
## Installation
As a git submodule:
```bash
git submodule add https://github.com/Osedea/nodock.git
```

Clone into your project:
```bash
git clone https://github.com/Osedea/nodock.git
```

We recommend you [fork this repository](https://github.com/Osedea/nodock#fork-destination-box) if you intend to add project specific scripts/configurations.

<a name="Usage"></a>
## Usage
```bash
cd nodock
# Run "node" and "nginx"
docker-compose up -d node nginx
```

To overwrite the `docker-compose.yml` file you can use a `docker-compose.override.yml`

```yaml
# docker-compose.override.yml

version: '3'

services:
    [...]
```
<a name="Examples"></a>
## Examples
We provide examples of configurations you might use for a specific stack. Each example has it's own README file with instructions.

* [Simple Web with Apache](https://github.com/Osedea/nodock/tree/master/_examples/apache) - Node + Apache
* [Simple Web with Nginx](https://github.com/Osedea/nodock/tree/master/_examples/nginx) - Node + NGINX
* [MySQL](https://github.com/Osedea/nodock/tree/master/_examples/mysql) - MySQL + Node + NGINX
* [PostgreSQL](https://github.com/Osedea/nodock/tree/master/_examples/postgresql) - PostgreSQL + Node + NGINX
* [Mongo](https://github.com/Osedea/nodock/tree/master/_examples/mongo) - MongoDB + Node + NGINX
* [RabbitMQ](https://github.com/Osedea/nodock/tree/master/_examples/rabbitmq) - RabbitMQ + Node + NGINX
* [Memcached](https://github.com/Osedea/nodock/tree/master/_examples/memcached) - Memcached + Node + NGINX
* [Redis](https://github.com/Osedea/nodock/tree/master/_examples/redis) - Redis + Node + NGINX
* [RethinkDB](https://github.com/Osedea/nodock/tree/master/_examples/rethinkdb) - RethinkDB + Node + NGINX
* [2 Node Apps](https://github.com/Osedea/nodock/tree/master/_examples/2-nodes) - Node + Node + NGINX

<a name="Workspace"></a>
## Workspace
The `workspace` container is where you want to be manually running commands for `NoDock`. You can use this container to initialize your project, for task-automation, for [cronjobs](#Cronjobs), etc.

<a name="HTTPS"></a>
## Using HTTPS
By default HTTPS is disabled. To enable it, you may use the following settings

```yaml
# docker-compose.override.yml
[...]
    nginx:
        build:
            args:
                - WEB_SSL=true
```
Add your certificate to `nginx/certs/cacert.pem` and the private key to `nginx/certs/privkey.pem`.
<a name="SelfSigned"></a>
#### Generate and use a self-signed cert
`SELF_SIGNED: "true"` will generate the necessary files, do note that `SELF_SIGNED: "true"` as no effect if `WEB_SSL: "false"`

```yaml
# docker-compose.override.yml
[...]
    nginx:
        build:
            args:
                - WEB_SSL=true
                - SELF_SIGNED=true
```
<a name="Certbot"></a>
#### Use Certbot (Let's Encrypt) to generate the cert
`CN` must be a publicly accessible address and `EMAIL` should be the server admin contact email.

```yaml
# docker-compose.override.yml
[...]
    nginx:
        build:
            args:
                - WEB_SSL=true
    certbot:
        environment:
            - CN=example.com
            - EMAIL=fake@gmail.com
```
Don't forget to bring up the container if you plan on using certbot (`docker-compose up -d certbot`).
<a name="Non-Web"></a>
## Running a single non-web container
The default NGINX server block configuration is aimed at web projects but if you want to have a single non-web container you can do something similar to the following configuration.

```yaml
# docker-compose.override.yml
[...]
    nginx:
        build:
            args:
                -NO_DEFAULT=true
        ports:
            - "10000:10000"
```

Do note that using `NO_DEFAULT` makes `WEB_REVERSE_PROXY_PORT`, `WEB_SSL` and `SELF_SIGNED` have no effect.

You will then have to provide your own NGINX server block like so

```
# nginx/sites/custom-node.conf

server {
    listen 10000 default_server;

    location / {
        proxy_pass http://node:5000;
    }
}
```
<a name="Multi-Node"></a>
## Running multiple node containers
To add more node containers, simply add the following to your `docker-compose.override.yml` or environment specific docker-compose file.

```yaml
# docker-compose.override.yml
[...]
    node2: # name of new container
        build:  # reuse the same values from the node service, cannot use extends in docker-compose 3+
            context: ./node
            args:
                - NODE_VERSION=latest
                - PROJECT_PATH=/opt/app/
                - NODE_ENV=production
                - YARN=false
        volumes:
            - ../:/opt/app
        entrypoint: run-nodock "node alternate.js" # the entrypoint for the "node2" container
    nginx:
        ports:
            - "10000:10000" # the port(s) to forward for the "node2" container
        links:
            - node2 # link "nginx" to "node2"
```

You'll also need to add a server block for "node2".
```
# nginx/sites/node2.conf

server {
    listen 10000 default_server;

    location / {
        proxy_pass http://node2:8000;
    }
}
```

<a name="Cronjobs"></a>
## Cronjobs
You can run cronjobs in the [Workspace](#Workspace) by storing them in the `workspace/crontab/root` file.
```
# workspace/crontab/root

* * * * * echo "Every Minute" >> /var/log/cron.log
```

<a name="More-Options"></a>
## More Options
To customize the NoDock installation, either add a `docker-compose.override.yml` in the NoDock directory or store environment specific configurations.

```bash
docker-compose -f nodock/docker-compose.yml -f docker-compose.dev.yml up -d
```
<a name="Use-Yarn"></a>
#### Use Yarn
Set the `YARN` argument to `true`.
```yaml
# docker-compose.override.yml
[...]
    node:
        build:
            args:
                - YARN=true
```
<a name="Node-Entrypoint"></a>
#### Change the node entrypoint
Use `main.js` instead of `index.js`
```yaml
# docker-compose.override.yml
[...]
    node:
        entrypoint: run-nodock "node main.js"
```
<a name="Node-Environment"></a>
#### Change the Node Environment
The default `NODE_ENV` value is `production`, you can change it to development by doing the following
```yaml
# docker-compose.override.yml
[...]
    node:
        build:
            args:
                - NODE_ENV=development
```
<a name="Node-Version"></a>
#### Use a specific Node version
The default node version is `latest`, this is **NOT** advisable for production
```yaml
# docker-compose.override.yml
[...]
    node:
        build:
            args:
                - NODE_VERSION=4.6.0
```
<a name="Node-Project-Path"></a>
#### Change the Node project path
You can specify a `PROJECT_PATH` to change the directory in which `npm` will perform it's `install` command and the directory in which `run-nodock` will run the entrypoint script. This is most desirable when running more than one Node project at a time since they are bound to each have their own `package.json` file.
```yaml
# docker-compose.override.yml
[...]
    node:
        build:
            args:
                PROJECT_PATH: somefolder # note that this is the same as "/opt/app/somefolder"

```
<a name="MySQL-Database-User"></a>
#### Change the MySQL database/user/password
```yaml
# docker-compose.override.yml
[...]
    mysql:
        build:
            args:
                - MYSQL_DATABASE=default_database
                - MYSQL_USER=default_user
                - MYSQL_PASSWORD=secret
```
<a name="PostgreSQL-Database-User"></a>
#### Change the PostgreSQL database/user/password
```yaml
# docker-compose.override.yml
[...]
    postgresql:
        build:
            args:
                - POSTGRES_DB=default_db
                - POSTGRES_USER=default_user
                - POSTGRES_PASSWORD=secret
```



<a name="NGINX-Reverse-Proxy-Port"></a>
#### Change the NGINX reverse proxy port
Use port `8080` instead of `8000` to bind your Node server
```yaml
# docker-compose.override.yml
[...]
    nginx:
        build:
            args:
                - WEB_REVERSE_PROXY_PORT=8080
```
<a name="Change-the-timezone"></a>
#### Change the timezone

To change the timezone for the `workspace` container, modify the `TZ` build argument in the Docker Compose file to one in the [TZ database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

For example, if I want the timezone to be `New York`:
```yaml
# docker-compose.override.yml
[...]
     workspace:
        build:
            context: ./workspace
            args:
                - TZ="America/New_York"
```
<a name="Use-RabbitMQ-plugins"></a>
#### Use RabbitMQ plugins
At the moment, NoDock supports 2 plugins: [Management](https://www.rabbitmq.com/management.html) and [Federation](https://www.rabbitmq.com/federation.html).

To activate them, change their values to `true` in your docker-compose file:
```yaml
# docker-compose.override.yml
[...]
    rabbitmq:
        build:
            args:
                - MANAGEMENT=true
                - FEDERATION=true
```
<a name="Change-RabbitMQ-User"></a>
#### Change the RabbitMQ user/password
```yaml
# docker-compose.override.yml
[...]
    rabbitmq:
        build:
            args:
                - RABBITMQ_DEFAULT_USER=custom_user
                - RABBITMQ_DEFAULT_PASS=custom_pass
```
<a name="Modify-Redis-Config"></a>
#### Modify the Redis config
You can edit `redis/redis.conf` to modify the redis config.

<a name="Contributing"></a>
## Contributing
Do not hesitate to contribute to NoDock by creating an issue, fixing a bug or bringing a new idea to the table.

To fix a bug or introduce a new feature, please create a PR, we will merge it in to the `master` branch after review.

We thank you in advance for contributing.
<a name="License"></a>
## License
[MIT License](https://github.com/laradock/laradock/blob/master/LICENSE) (MIT)
<a name="credits"></a>
## Credits
NoDock uses Open Source components. You can find the source code of their open source projects along with license information below. We acknowledge and are grateful to these developers for their contributions to open source.

Project: LaraDock https://github.com/LaraDock/laradock <br>
Copyright (c) 2016 Mahmoud Zalt (mahmoud@zalt.me) <br>
License (MIT) https://github.com/LaraDock/laradock/blob/master/LICENSE <br>

Project: baseimage-docker https://github.com/phusion/baseimage-docker <br>
Copyright (c)  2013-2015 Phusion Holding B.V. <br>
License (MIT) https://github.com/phusion/baseimage-docker/blob/master/LICENSE.txt <br>
