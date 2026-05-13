#!/usr/bin/env bash
#
# VPS-side backup script for bigcapital-fork (sandbox or UAT).
#
# Installed at /srv/portal/clients/<env>/backup.sh (mode 0750, root:root) and
# called by cron at 03:17 daily (see deploy/bigcapital-*-backup.cron).
#
# Sources:
#   1. /srv/portal/clients/<env>/.env       — DB and S3 creds (already in place)
#   2. /etc/restic/bigcapital-<env>.env     — AWS keys + RESTIC_REPOSITORY + RESTIC_PASSWORD
#
# Per-run output:
#   /tmp/bc-backup-<env>-<ts>/
#     sql/<db-name>.sql                     — mysqldump per system + tenant DB
#     minio/                                — mirror of attachments bucket
#     env.copy                              — sanitized snapshot of .env
#   …then `restic backup`, `restic forget` with 7d/4w/6m retention, prune.
#
# Exit codes: 0 OK, non-zero failure (cron then logs to journald with the
# logger tag set in the cron file).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_DIR="$SCRIPT_DIR"
ENV_FILE="$ENV_DIR/.env"
COMPOSE_FILE="$ENV_DIR/docker-compose.ghcr.yml"

# Derive env name from the parent directory (e.g. /srv/portal/clients/sandbox-bc → sandbox-bc).
ENV_NAME="$(basename "$ENV_DIR")"
case "$ENV_NAME" in
  sandbox-bc)   RESTIC_ENV="/etc/restic/bigcapital-sandbox.env" ;;
  *)            RESTIC_ENV="/etc/restic/bigcapital-${ENV_NAME}.env" ;;
esac

TS="$(date -u +%Y%m%dT%H%M%SZ)"
STAGING="/tmp/bc-backup-${ENV_NAME}-${TS}"

log()  { printf '[backup] %s\n' "$*"; }
fail() { printf '[backup] ERROR: %s\n' "$*" >&2; exit 1; }

cleanup() { rm -rf "$STAGING" 2>/dev/null || true; }
trap cleanup EXIT

[[ -r "$ENV_FILE" ]] || fail "env file not readable: $ENV_FILE"
[[ -r "$RESTIC_ENV" ]] || fail "restic env not readable: $RESTIC_ENV"
[[ -f "$COMPOSE_FILE" ]] || fail "compose file not found: $COMPOSE_FILE"

# Source app env (DB creds, S3 keys, etc.). `set -a` exports every var.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
# shellcheck disable=SC1090
source "$RESTIC_ENV"
set +a

mkdir -p "$STAGING/sql" "$STAGING/minio"
log "Staging dir: $STAGING"

# --- MySQL / MariaDB dumps --------------------------------------------------
#
# mysqldump runs inside the existing mysql container. We discover tenant DBs
# by SHOW DATABASES filtered to ${TENANT_DB_NAME_PERFIX}* (note: env var name
# misspelled "PERFIX" upstream — preserved). System DB name comes from
# SYSTEM_DB_NAME.

MYSQL_SVC="mysql"
MYSQL_EXEC=(docker compose -f "$COMPOSE_FILE" exec -T "$MYSQL_SVC")

log "Enumerating databases…"
DB_LIST="$("${MYSQL_EXEC[@]}" mysql -u root -p"${DB_ROOT_PASSWORD}" \
            -B -N -e "SHOW DATABASES" < /dev/null 2>/dev/null \
          | grep -E "^(${SYSTEM_DB_NAME}|${TENANT_DB_NAME_PERFIX}.*)$" || true)"
[[ -n "$DB_LIST" ]] || fail "no databases matched system='${SYSTEM_DB_NAME}' or tenant prefix='${TENANT_DB_NAME_PERFIX}'"

# `< /dev/null` on mysqldump prevents `docker compose exec -T` from consuming
# the parent loop's here-string stdin — without it, only the first DB dumps
# and the loop terminates early.
while read -r DB; do
  [[ -n "$DB" ]] || continue
  log "  mysqldump → $DB"
  "${MYSQL_EXEC[@]}" mysqldump -u root -p"${DB_ROOT_PASSWORD}" \
       --single-transaction --quick --routines --triggers --events \
       "$DB" < /dev/null > "$STAGING/sql/${DB}.sql"
done <<< "$DB_LIST"

# --- MinIO mirror -----------------------------------------------------------
#
# Use a transient minio/mc container joined to the same network as MinIO so it
# can resolve the MinIO container by name. Auth via MC_HOST_<alias> URL.

# Discover the joined docker network name from the running MinIO container.
# Compose prefixes the logical network with its project name (e.g.
# sandbox-bc_bigcapital_sandbox_network), so we can't just use the logical
# name from `docker compose config`.
MINIO_CID="$(docker compose -f "$COMPOSE_FILE" ps -q minio)"
[[ -n "$MINIO_CID" ]] || fail "could not resolve MinIO container id"

MINIO_CONTAINER="$(docker inspect "$MINIO_CID" --format '{{.Name}}' | sed 's|^/||')"
[[ -n "$MINIO_CONTAINER" ]] || fail "could not resolve MinIO container name"

NET="$(docker inspect "$MINIO_CID" \
       --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' \
       | awk '{print $1}')"
[[ -n "$NET" ]] || fail "could not resolve docker network name from MinIO container"

log "Mirroring MinIO bucket '${S3_BUCKET}' from ${MINIO_CONTAINER}…"
docker run --rm \
  --network "$NET" \
  -v "$STAGING/minio:/backup" \
  -e "MC_HOST_src=http://${S3_ACCESS_KEY_ID}:${S3_SECRET_ACCESS_KEY}@${MINIO_CONTAINER}:9000" \
  minio/mc:latest mirror --overwrite "src/${S3_BUCKET}" /backup >/dev/null

# --- Copy .env (sanitized snapshot) -----------------------------------------

cp "$ENV_FILE" "$STAGING/env.copy"
chmod 0600 "$STAGING/env.copy"

# --- restic backup + retention prune ----------------------------------------

log "restic backup…"
restic backup --tag "env:${ENV_NAME}" --tag "ts:${TS}" "$STAGING"

log "restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune…"
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune

log "OK at $(date -u +%FT%TZ)"
