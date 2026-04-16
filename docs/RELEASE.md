# Release Process

Step-by-step instructions for building and deploying the Bigcapital fork to staging.bc.jjocllc.com.

## Prerequisites

- Docker running on your dev machine
- SSH access to the production server
- Node.js 18.16.1 (for local builds): `nvm use 18.16.1`

## Step 1: Build images (dev machine)

From the repo root:

```bash
docker build -f packages/server/Dockerfile -t bigcapital-fork-server:uat-v1 .
docker build -f packages/webapp/Dockerfile -t bigcapital-fork-webapp:uat-v1 .
```

If only one side changed, you can skip the other:
- **Server-only changes** (API, i18n, services): rebuild server image only
- **Webapp-only changes** (UI, hooks, lang): rebuild webapp image only
- **Both** (most releases): rebuild both

## Step 2: Save and transfer

```bash
docker save bigcapital-fork-server:uat-v1 | gzip > bigcapital-fork-server-uat-v1.tar.gz
docker save bigcapital-fork-webapp:uat-v1 | gzip > bigcapital-fork-webapp-uat-v1.tar.gz
scp bigcapital-fork-server-uat-v1.tar.gz bigcapital-fork-webapp-uat-v1.tar.gz user@staging.bc.jjocllc.com:/tmp/
```

## Step 3: Load images (production server)

```bash
ssh user@staging.bc.jjocllc.com
docker load < /tmp/bigcapital-fork-server-uat-v1.tar.gz
docker load < /tmp/bigcapital-fork-webapp-uat-v1.tar.gz
```

## Step 4: Run migrations

```bash
cd /srv/portal/clients/staging-bc
docker compose -f docker-compose.prod.yml up database_migration
```

Wait for "Migrations complete" before proceeding. If no schema changes, this completes instantly.

## Step 5: Deploy

```bash
docker compose -f docker-compose.prod.yml up -d --force-recreate server webapp
```

The `--force-recreate` flag ensures new containers are created from the freshly loaded images even though the compose file hasn't changed.

## Step 6: Verify

```bash
# Containers running
docker compose -f docker-compose.prod.yml ps

# Server logs clean
docker logs bigcapital-fork-server --tail 30

# API responds
curl -sv https://staging.bc.jjocllc.com/api/auth/meta 2>&1 | grep "< HTTP"

# SPA loads
curl -sv https://staging.bc.jjocllc.com/ 2>&1 | grep "< HTTP"
```

## Cleanup (optional)

Remove transferred tarballs from the server:

```bash
rm /tmp/bigcapital-fork-server-uat-v1.tar.gz /tmp/bigcapital-fork-webapp-uat-v1.tar.gz
```

## Rollback

If the new release has issues, re-load the previous image tarballs and recreate:

```bash
docker load < /path/to/previous/bigcapital-fork-server-uat-v1.tar.gz
docker load < /path/to/previous/bigcapital-fork-webapp-uat-v1.tar.gz
docker compose -f docker-compose.prod.yml up -d --force-recreate server webapp
```

Keep at least one previous set of tarballs for rollback.

## Troubleshooting

See `docs/DEPLOY.md` for common issues (rate limiting, MySQL grants, migration paths, font serving, etc.).
