#!/usr/bin/env bash
#
# VPS-side deploy script for bigcapital-fork GHCR pipeline.
#
# Installed at /srv/portal/clients/<env>/deploy.sh (mode 0750, root:root).
# Triggered by SSH from GitHub Actions; the SSH key is locked to running ONLY
# this script (command="sudo /srv/portal/clients/<env>/deploy.sh" in
# authorized_keys + a NOPASSWD sudoers rule).
#
# Arguments arrive via $SSH_ORIGINAL_COMMAND so the regex below is the entire
# allowlist of what this script will accept. Anything that doesn't match two
# valid SHAs separated by a single space is rejected before any docker work.
#
# Expected SSH_ORIGINAL_COMMAND format:
#   "<server-sha> <webapp-sha>"
# where each SHA is 7-40 hex characters.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.ghcr.yml"
SERVER_IMAGE_BASE="ghcr.io/crxnit/bigcapital-server"
WEBAPP_IMAGE_BASE="ghcr.io/crxnit/bigcapital-webapp"

log() { printf '[deploy] %s\n' "$*"; }
fail() { printf '[deploy] ERROR: %s\n' "$*" >&2; exit 1; }

# --- Parse and validate SHAs from SSH_ORIGINAL_COMMAND ----------------------

RAW="${SSH_ORIGINAL_COMMAND:-}"
[[ -n "$RAW" ]] || fail "Invalid or missing image tag — SSH_ORIGINAL_COMMAND empty"

# Strict allowlist regex: two hex SHAs (7-40 chars), single space, nothing else.
if [[ ! "$RAW" =~ ^([a-f0-9]{7,40})[[:space:]]+([a-f0-9]{7,40})$ ]]; then
  fail "Invalid or missing image tag — expected '<server-sha> <webapp-sha>', got: $RAW"
fi

SERVER_SHA="${BASH_REMATCH[1]}"
WEBAPP_SHA="${BASH_REMATCH[2]}"

log "Deploying server sha-$SERVER_SHA + webapp sha-$WEBAPP_SHA"

# --- Pin compose image tags -------------------------------------------------

cd "$SCRIPT_DIR"
[[ -f "$COMPOSE_FILE" ]] || fail "compose file not found: $COMPOSE_FILE"

# Pin both image lines. Match the base name then any tag suffix up to the line
# end; the new tag is sha-<short>. Run sed in-place; if sed fails, exit before
# touching docker.
sed -i.bak -E \
  -e "s|${SERVER_IMAGE_BASE}:[^[:space:]\"]+|${SERVER_IMAGE_BASE}:sha-${SERVER_SHA}|g" \
  -e "s|${WEBAPP_IMAGE_BASE}:[^[:space:]\"]+|${WEBAPP_IMAGE_BASE}:sha-${WEBAPP_SHA}|g" \
  "$COMPOSE_FILE"

# Sanity: confirm the new tags are present.
grep -q "${SERVER_IMAGE_BASE}:sha-${SERVER_SHA}" "$COMPOSE_FILE" \
  || fail "compose sed did not update server image tag"
grep -q "${WEBAPP_IMAGE_BASE}:sha-${WEBAPP_SHA}" "$COMPOSE_FILE" \
  || fail "compose sed did not update webapp image tag"

log "Image tags pinned in $COMPOSE_FILE"

# --- Pull images ------------------------------------------------------------

log "Pulling images from GHCR…"
docker compose -f "$COMPOSE_FILE" pull server webapp database_migration

# --- Run migrations ---------------------------------------------------------
#
# The migration container is one-shot — its `command:` exits 0 on success and
# non-zero on failure. We force-recreate it so a stuck previous run is replaced,
# then `docker wait` blocks until exit and yields the status code.

log "Running tenant + system migrations…"
docker compose -f "$COMPOSE_FILE" up -d --force-recreate database_migration

MIGRATION_CID="$(docker compose -f "$COMPOSE_FILE" ps -q database_migration)"
[[ -n "$MIGRATION_CID" ]] || fail "could not resolve database_migration container id"

# Block on the migration. If it crashes, surface logs before failing.
MIGRATION_EXIT="$(docker wait "$MIGRATION_CID")"
if [[ "$MIGRATION_EXIT" != "0" ]]; then
  log "Migration exited with status $MIGRATION_EXIT — logs follow:"
  docker logs --tail 200 "$MIGRATION_CID" || true
  fail "Migration failed; server/webapp NOT restarted. Old containers still serving traffic."
fi
log "Migrations OK"

# --- Recreate server + webapp on new images ---------------------------------

log "Recreating server + webapp on new images…"
docker compose -f "$COMPOSE_FILE" up -d server webapp

# --- Smoke test via Docker healthcheck status -------------------------------
#
# The server image's HEALTHCHECK hits /api/health internally. We poll the
# health status (set by Docker once the healthcheck has run a few times) up to
# ~60 seconds before giving up.

SERVER_CID="$(docker compose -f "$COMPOSE_FILE" ps -q server)"
[[ -n "$SERVER_CID" ]] || fail "could not resolve server container id"

log "Waiting for server health…"
for i in $(seq 1 30); do
  STATUS="$(docker inspect --format='{{.State.Health.Status}}' "$SERVER_CID" 2>/dev/null || echo unknown)"
  case "$STATUS" in
    healthy)
      log "Server reports healthy after ${i}x 2s"
      log "OK at $(date -u +%FT%TZ)"
      exit 0
      ;;
    unhealthy)
      log "Server unhealthy — logs follow:"
      docker logs --tail 200 "$SERVER_CID" || true
      fail "Health check reported unhealthy"
      ;;
  esac
  sleep 2
done

log "Server did not reach healthy in 60s (last status: $STATUS) — logs follow:"
docker logs --tail 200 "$SERVER_CID" || true
fail "Health check timed out"
