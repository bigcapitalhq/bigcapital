# Sandbox clone of staging.bc.jjocllc.com

Parallel environment at `https://sandbox.bc.jjocllc.com` for Square integration
testing. Runs alongside the staging stack on the same host, fully isolated at
the container/volume/network layer. Initial data is a one-time clone of staging.

## Image tags

Sandbox runs its own image tags (`bigcapital-fork-server:sandbox-v1` and
`bigcapital-fork-webapp:sandbox-v1`), independent from staging's
`:uat-v1`. You can push a newer build to sandbox without touching
staging and vice versa — bump the tag on one side, re-run
`docker compose up -d` on that side only.

### Building + transferring sandbox images

Built image tarballs live under `current-images/<env>/` in the repo
root — one folder per environment — so staging and sandbox artifacts
never get confused. That directory is gitignored (see repo
`.gitignore`).

On your dev machine (Colima needs ≥ 8 GB of memory for the webapp build):

```bash
# From the repo root
nvm use 18.16.1
mkdir -p current-images/sandbox

docker build -t bigcapital-fork-server:sandbox-v1 \
  -f packages/server/Dockerfile .
docker build -t bigcapital-fork-webapp:sandbox-v1 \
  -f packages/webapp/Dockerfile .

docker save bigcapital-fork-server:sandbox-v1 \
  | gzip > current-images/sandbox/bigcapital-fork-server-sandbox-v1.tar.gz
docker save bigcapital-fork-webapp:sandbox-v1 \
  | gzip > current-images/sandbox/bigcapital-fork-webapp-sandbox-v1.tar.gz

scp current-images/sandbox/bigcapital-fork-*-sandbox-v1.tar.gz \
  root@<staging-host>:/tmp/
```

On the host:
```bash
gunzip -c /tmp/bigcapital-fork-server-sandbox-v1.tar.gz  | docker load
gunzip -c /tmp/bigcapital-fork-webapp-sandbox-v1.tar.gz  | docker load

# Confirm:
docker image ls | grep sandbox-v1
```

Subsequent releases: bump the tag (`sandbox-v2`, `sandbox-v3`, …),
rebuild into `current-images/sandbox/`, update the two `image:` lines
in `/srv/portal/clients/sandbox-bc/docker-compose.yml`, then
`docker compose up -d --force-recreate server webapp`. Keep the old
tarball around in `current-images/sandbox/` for quick rollback; prune
once you're confident.

(Staging images follow the same pattern under
`current-images/staging/` — apply the convention any time you save a
tarball for either environment.)

## One-time setup

### 1. DNS + OAuth provider
- Add an `A` record `sandbox.bc.jjocllc.com` pointing at the staging host.
- **Google OAuth (forward-auth)**: nothing to do. The deployment uses a
  centralized oauth2-proxy at `portal.jjocllc.com/oauth2/callback` and a
  shared session cookie on `.jjocllc.com`, so every `*.jjocllc.com`
  subdomain — including the new `sandbox.bc.jjocllc.com` — is already
  covered by the existing Google Cloud OAuth client.
- **Square sandbox app**: register a *second* Square sandbox OAuth app in
  the Square Developer Dashboard dedicated to sandbox.bc.jjocllc.com, and
  set its OAuth redirect URL to
  `https://sandbox.bc.jjocllc.com/api/integrations/square/oauth/callback`.
  Note the new Application ID + Secret for sandbox `.env`.

### 2. Host directory + files
```bash
mkdir -p /srv/portal/clients/sandbox-bc/traefik-dynamic
cd /srv/portal/clients/sandbox-bc

# scp these from the repo:
#   docker-compose.yml        (from docker/sandbox-bc/docker-compose.yml)
#   .env                      (from docker/sandbox-bc/.env.example; fill it in)
#   traefik-dynamic/sandbox-bc.yml
```
Also copy `/srv/portal/clients/sandbox-bc/traefik-dynamic/sandbox-bc.yml`
into Traefik's dynamic config dir (commonly `/etc/traefik/dynamic/`).
Traefik hot-reloads dynamic config; `docker logs traefik` should show the
new routers loaded with no errors.

### 3. Clone staging data

**While staging MySQL + MinIO are up** (a consistent snapshot is fine while
the app is live for read-heavy staging):
```bash
# --- MySQL dump ---
docker exec bigcapital-fork-mysql sh -c \
  'exec mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" \
    --all-databases --routines --triggers --single-transaction --quick' \
  > /tmp/staging-mysql.sql

# --- MinIO clone ---
# Stop staging's MinIO briefly for a consistent file snapshot, or use mc mirror.
# The volume-copy path below is simplest; do it when no uploads are in-flight.
docker run --rm \
  -v bigcapital_prod_fork_minio:/src \
  -v bigcapital_sandbox_minio:/dst \
  alpine sh -c 'cp -a /src/. /dst/'
```

### 4. First boot
```bash
cd /srv/portal/clients/sandbox-bc
# Bring MySQL up first so we can restore into it.
docker compose up -d mysql
# Wait for it to be ready (~10s).
until docker exec bigcapital-sandbox-mysql mysqladmin ping -u root -p"$(grep DB_ROOT_PASSWORD .env | cut -d= -f2-)" --silent; do sleep 2; done

# Restore the staging dump:
docker exec -i bigcapital-sandbox-mysql \
  mysql -u root -p"$(grep DB_ROOT_PASSWORD .env | cut -d= -f2-)" < /tmp/staging-mysql.sql

# Bring up the rest of the stack (triggers migrations and MinIO bucket init):
docker compose up -d
docker logs -f bigcapital-sandbox-database-migration
# Wait for "Migrations complete" (new migrations run; cloned DB already had
# the old ones, so only the Square Phase-1 migrations fire if you cloned
# before deploying them to staging).
```

### 5. Post-clone tidying (recommended)

Wipe any Square connection rows that came along from staging — their
encrypted access tokens won't decrypt under the sandbox's different
`SQUARE_TOKEN_ENCRYPTION_KEY`, and you want a clean setup experience:
```bash
for db in $(docker exec bigcapital-sandbox-mysql mysql -u root \
  -p"$DB_ROOT_PASSWORD" -Nse "SHOW DATABASES LIKE 'bigcapital_tenant_%'"); do
  docker exec bigcapital-sandbox-mysql mysql -u root -p"$DB_ROOT_PASSWORD" \
    -e "DELETE FROM SQUARE_EVENT_LOG; DELETE FROM SQUARE_ITEM_MAPPINGS; \
        DELETE FROM SQUARE_CUSTOMER_MAPPINGS; DELETE FROM SQUARE_CONNECTIONS;" \
    $db
done
```

### 6. Smoke test
- Hit `https://sandbox.bc.jjocllc.com` → Google OAuth prompt → Bigcapital
  login using your existing staging credentials (cloned user rows).
- Your existing customers/items/accounts are present.
- `/preferences/integrations/square` is empty (post-tidying). Click
  *Connect Square* → OAuth through the new Square sandbox app →
  wizard → active.

## Refreshing the clone later

When you want to re-pull staging data (e.g. to inherit new accounting
records your testers created):
```bash
cd /srv/portal/clients/sandbox-bc
docker compose down           # stop the sandbox
docker volume rm bigcapital_sandbox_mysql bigcapital_sandbox_minio
# re-run the dump + volume-copy steps from Section 3
docker compose up -d
```
This is a nuclear reset of the sandbox — any Square connections, events,
or sandbox-only test transactions are wiped. That's usually what you want.

## Tearing it down

```bash
cd /srv/portal/clients/sandbox-bc
docker compose down -v        # -v removes the named volumes
# Remove the Traefik dynamic config:
rm /etc/traefik/dynamic/sandbox-bc.yml
# Optionally remove the DNS record.
```
Staging is untouched.

## Gotchas

- **Plaid/Stripe webhooks** still fire at staging. Don't be surprised when
  Plaid transactions don't update in sandbox — that's expected. If you
  need live bank sync in sandbox, register parallel Plaid/Stripe apps.
- **Sign-up email confirmation**: if staging sends verification emails
  from a real inbox, sandbox will too (same `MAIL_*` creds). Use a
  throw-away test email or disable `SIGNUP_EMAIL_CONFIRMATION`.
- **TLS certs**: Traefik will request a fresh Let's Encrypt cert for
  `sandbox.bc.jjocllc.com` on first request; can take up to a minute.
- **Image rebuilds**: if you push a new image tag (e.g. `uat-v2`), update
  both stacks' compose files — the sandbox compose currently pins `uat-v1`
  same as staging so they move in lockstep unless you decide otherwise.
