# Deploying Bigcapital to staging.bc.jjocllc.com

## Prerequisites

- Docker and Docker Compose on the production server
- Traefik running as a container, connected to the `portal-net` network
- Traefik watching a dynamic config directory (e.g. `/etc/traefik/dynamic/`)
- Let's Encrypt cert resolver named `letsencrypt` configured in Traefik's static config
- OAuth2-proxy middleware named `oauth2-proxy-jjocllc-com` already defined and working

## Step 1: Build images locally

From the repo root on your dev machine:

```bash
nvm use 18.16.1

# Build the server image
docker build -f packages/server/Dockerfile -t bigcapital-server:prod .

# Build the webapp image
docker build -f packages/webapp/Dockerfile -t bigcapital-webapp:prod .
```

## Step 2: Save images to tar files

```bash
docker save bigcapital-server:prod | gzip > bigcapital-server-prod.tar.gz
docker save bigcapital-webapp:prod | gzip > bigcapital-webapp-prod.tar.gz
```

## Step 3: Transfer to the production server

```bash
scp bigcapital-server-prod.tar.gz bigcapital-webapp-prod.tar.gz user@staging.bc.jjocllc.com:/tmp/
```

## Step 4: Load images on the production server

```bash
ssh user@staging.bc.jjocllc.com

docker load < /tmp/bigcapital-server-prod.tar.gz
docker load < /tmp/bigcapital-webapp-prod.tar.gz

# Verify
docker images | grep bigcapital
# Should show bigcapital-server:prod and bigcapital-webapp:prod
```

## Step 5: Prepare the deployment directory

On the production server, create a directory for the Bigcapital stack:

```bash
mkdir -p /opt/bigcapital
cd /opt/bigcapital
```

Copy these files from the repo to `/opt/bigcapital/`:

```
docker-compose.prod.yml
.env.production  →  rename to .env
docker/mariadb/  (entire directory)
docker/redis/    (entire directory)
```

The directory should look like:

```
/opt/bigcapital/
├── docker-compose.prod.yml
├── .env
└── docker/
    ├── mariadb/
    │   ├── Dockerfile
    │   ├── my.cnf
    │   ├── init.sql
    │   └── docker-entrypoint.sh
    └── redis/
        ├── Dockerfile
        └── redis.conf
```

## Step 6: Configure environment

Edit `/opt/bigcapital/.env` and fill in every line marked `[CHANGE]`:

- `JWT_SECRET` — generate with `openssl rand -base64 32`
- `DB_PASSWORD` — generate with `openssl rand -base64 24`
- `DB_ROOT_PASSWORD` — generate with `openssl rand -base64 24`
- `BASE_URL` — should be `https://staging.bc.jjocllc.com`
- **Rate limiting** — the app uses NestJS throttler with Redis storage. Set `THROTTLE_GLOBAL_LIMIT=600` (requests) and `THROTTLE_GLOBAL_TTL=60000` (ms) for normal SPA usage. Also bump `THROTTLE_AUTH_LIMIT=60` for auth endpoints (default 10 is too strict). The legacy `API_RATE_LIMIT` variable is **not used** — ignore it in any old docs.
- SMTP credentials for outbound email
- S3 credentials if using file attachments

## Step 7: Install Traefik dynamic config

Copy the Traefik routing file into Traefik's watched directory:

```bash
cp docker/traefik/bigcapital.yml /etc/traefik/dynamic/bigcapital.yml
```

> **Note:** Adjust the path to wherever your Traefik instance watches for
> dynamic config files. Traefik will pick it up automatically — no restart needed.
>
> **Important:** The `oauth2-proxy-jjocllc-com` middleware referenced in
> `bigcapital.yml` must already be defined (either in another dynamic file or
> as a Docker label on the oauth2-proxy container). If the middleware name
> differs, edit `bigcapital.yml` before copying.

### Verify Traefik sees the routes

If Traefik's API/dashboard is enabled:

```bash
curl -s http://localhost:8080/api/rawdata | jq '.routers | keys[]' | grep bigcapital
```

Should return:
```
"bigcapital-api@file"
"bigcapital-http-redirect@file"
"bigcapital-webapp@file"
```

## Step 8: Bring up the stack

```bash
cd /opt/bigcapital

# Start database and redis first (they need to be healthy before migrations)
docker compose -f docker-compose.prod.yml up -d mysql redis

# Wait for MySQL to accept connections (~15-30 seconds on first run)
until docker exec bigcapital-mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
  echo "Waiting for MySQL..."
  sleep 3
done
echo "MySQL is ready"

# Run migrations (one-shot container, exits when done)
docker compose -f docker-compose.prod.yml up database_migration

# Start the rest of the stack
docker compose -f docker-compose.prod.yml up -d
```

## Step 9: Verification checklist

Run these from the production server (or anywhere that can reach the host):

```bash
# 1. SPA loads
curl -sv https://staging.bc.jjocllc.com/ 2>&1 | grep "< HTTP"
# Expect: HTTP/2 200 (or 302 to OAuth if not authenticated)

# 2. API responds
curl -sv https://staging.bc.jjocllc.com/api/auth/meta 2>&1 | grep "< HTTP"
# Expect: HTTP/2 200 with JSON

# 3. TLS certificate
echo | openssl s_client -connect staging.bc.jjocllc.com:443 -servername staging.bc.jjocllc.com 2>/dev/null | openssl x509 -noout -dates -issuer
# Expect: Let's Encrypt issuer, valid dates

# 4. WebSocket upgrade (Socket.IO)
# Open browser devtools → Network → WS tab → confirm /socket/ upgrades to 101

# 5. Container health
docker compose -f docker-compose.prod.yml ps
# All services should show "Up" (database_migration will show "Exited (0)")

# 6. Server logs look clean
docker logs bigcapital-server --tail 50
```

## Upgrading

To deploy a new version:

```bash
# On dev machine: rebuild, save, transfer (Steps 1-3)

# On production server:
cd /opt/bigcapital
docker compose -f docker-compose.prod.yml down
docker load < /tmp/bigcapital-server-prod.tar.gz
docker load < /tmp/bigcapital-webapp-prod.tar.gz
docker compose -f docker-compose.prod.yml up database_migration   # run migrations
docker compose -f docker-compose.prod.yml up -d                    # start everything
```

## Troubleshooting

**Migration fails with "connection refused"**
MySQL isn't ready yet. The migration container retries automatically via `nc -z mysql 3306`. Check `docker logs bigcapital-mysql`.

**Traefik returns 404**
The containers aren't on the `portal-net` network. Verify: `docker network inspect portal-net | jq '.[0].Containers'` — should list `bigcapital-server` and `bigcapital-webapp`.

**OAuth redirect loop**
The OAuth middleware is redirecting POST requests (e.g. `/api/auth/signin`). Ensure your oauth2-proxy config passes through requests that already carry a valid session cookie.

**PDF generation fails**
Gotenberg can't reach the server at `http://server:3000/public/`. Verify both are on `bigcapital_network`: `docker exec bigcapital-gotenberg wget -qO- http://bigcapital-server:3000/public/ || echo FAIL`. Note: the `GOTENBERG_DOCS_URL` env var uses the service name `server` — if you changed the container name, update this.

**"Too many requests" modal in the webapp**
The NestJS throttler is blocking the client. **Important:** `API_RATE_LIMIT` is a legacy variable and is NOT used by the app — setting it does nothing. Use these instead in `.env`:
```
THROTTLE_GLOBAL_LIMIT=600
THROTTLE_GLOBAL_TTL=60000
THROTTLE_AUTH_LIMIT=60
THROTTLE_AUTH_TTL=60000
```
Defaults are 100 req/min global, 10 req/min auth — both too strict for SPA usage. State is stored in Redis — restart Redis AND the server to clear the in-memory/Redis throttle state:
```
docker compose -f docker-compose.prod.yml restart redis server
```

**MySQL "Access denied" when creating an organization**
The MariaDB init script (`docker/mariadb/init.sql`) grants `ALL PRIVILEGES ON *.*` but only runs on first database initialization. If the MySQL volume already existed before the init script was corrected, the grants were never applied. Fix manually: `docker exec -it bigcapital-fork-mysql mysql -u root -p"${DB_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON *.* TO 'bigcapital'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"`

**Migration fails with "ENOENT: no such file or directory, scandir '/app/src/database/system/migrations'"**
The system migration directory is a relative path (`./src/database/system/migrations`) resolved from `cwd`. The migration container's `working_dir` must be `/app/packages/server` — not `/app` — so the path resolves to `/app/packages/server/src/database/system/migrations` where the Dockerfile copies the migration files.
