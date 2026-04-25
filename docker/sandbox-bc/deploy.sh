#!/usr/bin/env bash
#
# Build + ship sandbox images to the deploy host, bump compose tags, and
# force-recreate the running containers.
#
# Usage:
#   docker/sandbox-bc/deploy.sh                # both server + webapp
#   docker/sandbox-bc/deploy.sh server         # server only
#   docker/sandbox-bc/deploy.sh webapp         # webapp only
#   docker/sandbox-bc/deploy.sh server webapp  # explicit
#
# Required:
#   DEPLOY_HOST       SSH target, e.g. root@production-public-webproxy-portal-01
#                     Read from docker/sandbox-bc/.deploy.conf if present.
#
# Optional overrides:
#   DEPLOY_PORT       SSH port. Unset = use ~/.ssh/config or 22.
#   STAGING_PATH      Remote dir the SCP can write to without sudo, e.g.
#                     /home/john/staging. When set, files land here first
#                     and the remote step copies them into HOST_PATH using
#                     REMOTE_SUDO. When unset, scp goes straight to
#                     HOST_PATH (the original behaviour).
#   REMOTE_SUDO       Prefix for the privileged remote commands (cp, docker
#                     load, docker compose). Typical values: "" (unset, you
#                     are already root) or "sudo". When set, sudo MUST be
#                     configured passwordless for the SSH user on the host;
#                     the heredoc runs non-interactively and would hang on
#                     a password prompt.
#   ENV_NAME          default: sandbox
#   HOST_PATH         default: /srv/portal/clients/sandbox-bc
#   VERSION_NUM       default: auto-incremented from existing tarballs
#   COLIMA_MEMORY     default: 8        (GiB; needed for the webapp Vite build)
#   COLIMA_CPU        default: 2
#   COLIMA_DISK       default: 20
#
# .deploy.conf is git-ignored and can hold any of the above as KEY=VALUE.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT_DIR="$REPO_ROOT/docker/sandbox-bc"

# ── Config ──────────────────────────────────────────────────────────────────
[[ -f "$SCRIPT_DIR/.deploy.conf" ]] && source "$SCRIPT_DIR/.deploy.conf"

ENV_NAME="${ENV_NAME:-sandbox}"
HOST_PATH="${HOST_PATH:-/srv/portal/clients/sandbox-bc}"
DEPLOY_HOST="${DEPLOY_HOST:-}"
DEPLOY_PORT="${DEPLOY_PORT:-}"
STAGING_PATH="${STAGING_PATH:-}"
REMOTE_SUDO="${REMOTE_SUDO:-}"
COLIMA_MEMORY="${COLIMA_MEMORY:-8}"
COLIMA_CPU="${COLIMA_CPU:-2}"
COLIMA_DISK="${COLIMA_DISK:-20}"

IMAGES_DIR="$REPO_ROOT/current-images/$ENV_NAME"

if [[ -z "$DEPLOY_HOST" ]]; then
  echo "ERROR: DEPLOY_HOST not set." >&2
  echo "  Either export it, or write it to $SCRIPT_DIR/.deploy.conf:" >&2
  echo "    DEPLOY_HOST=root@your-host" >&2
  exit 1
fi

# Build per-tool port options. Empty when DEPLOY_PORT is unset, so the
# command lines defer to ~/.ssh/config (or the SSH default of 22).
SSH_OPTS=()
SCP_OPTS=()
if [[ -n "$DEPLOY_PORT" ]]; then
  SSH_OPTS+=(-p "$DEPLOY_PORT")
  SCP_OPTS+=(-P "$DEPLOY_PORT")  # scp uses -P (uppercase), unlike ssh.
fi

# ── Targets ─────────────────────────────────────────────────────────────────
TARGETS=("$@")
if [ ${#TARGETS[@]} -eq 0 ]; then
  TARGETS=(server webapp)
fi
for t in "${TARGETS[@]}"; do
  case "$t" in
    server|webapp) ;;
    *) echo "ERROR: unknown target '$t' (expected server or webapp)" >&2; exit 1 ;;
  esac
done

# ── Helpers ─────────────────────────────────────────────────────────────────
say() { printf '\n\033[1;34m▸\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*" >&2; }

ensure_colima() {
  if ! command -v colima >/dev/null 2>&1; then
    echo "ERROR: colima is not installed." >&2
    exit 1
  fi
  if colima status >/dev/null 2>&1; then
    say "Colima already running"
  else
    say "Colima is not running — starting (cpu=$COLIMA_CPU mem=${COLIMA_MEMORY}G disk=${COLIMA_DISK}G)"
    colima start --cpu "$COLIMA_CPU" --memory "$COLIMA_MEMORY" --disk "$COLIMA_DISK"
  fi

  # Best-effort warn if memory looks short — webapp Vite build OOMs under ~6G.
  local mem
  mem=$(colima list 2>/dev/null | awk 'NR==2 {for (i=1;i<=NF;i++) if ($i ~ /GiB$/) { sub("GiB","",$i); print $i; exit }}' || true)
  if [[ -n "${mem:-}" && "$mem" -lt 6 ]]; then
    warn "Colima memory ${mem}GiB is below the recommended 8GiB; the webapp build may OOM. Stop colima and re-run with COLIMA_MEMORY=8 to fix."
  fi
}

next_version() {
  local last
  last=$(
    ls "$IMAGES_DIR" 2>/dev/null \
      | grep -oE "${ENV_NAME}-v[0-9]+" \
      | sed "s/${ENV_NAME}-v//" \
      | sort -n \
      | tail -1
  )
  echo $((${last:-0} + 1))
}

build_and_save() {
  local svc="$1"
  local img="bigcapital-fork-$svc:$TAG"
  local tar="$IMAGES_DIR/$svc-$TAG.tar.gz"

  say "Building $img"
  (cd "$REPO_ROOT" && docker build -f "packages/$svc/Dockerfile" -t "$img" .)

  say "Saving $tar"
  mkdir -p "$IMAGES_DIR"
  docker save "$img" | gzip > "$tar"

  # Land in STAGING_PATH if set (caller has scp permission there but not
  # to HOST_PATH); the remote step copies into place with REMOTE_SUDO.
  local scp_target="${STAGING_PATH:-$HOST_PATH}"
  say "scp → $DEPLOY_HOST:$scp_target/"
  scp ${SCP_OPTS[@]+"${SCP_OPTS[@]}"} "$tar" "$DEPLOY_HOST:$scp_target/"
}

# ── Run ─────────────────────────────────────────────────────────────────────
ensure_colima

VERSION_NUM="${VERSION_NUM:-$(next_version)}"
TAG="$ENV_NAME-v$VERSION_NUM"
say "Deploying tag: $TAG (targets: ${TARGETS[*]})"

# Make sure the staging directory exists before scp lands files there —
# scp errors with "dest open: Failure" otherwise (newer OpenSSH/SFTP do
# not auto-create the path).
if [[ -n "$STAGING_PATH" ]]; then
  say "Ensuring $DEPLOY_HOST:$STAGING_PATH/ exists"
  ssh ${SSH_OPTS[@]+"${SSH_OPTS[@]}"} "$DEPLOY_HOST" "mkdir -p '$STAGING_PATH'"
fi

for svc in "${TARGETS[@]}"; do
  build_and_save "$svc"
done

say "Loading + recreating on $DEPLOY_HOST"
ssh ${SSH_OPTS[@]+"${SSH_OPTS[@]}"} "$DEPLOY_HOST" "bash -s --" \
  "$ENV_NAME" "$TAG" "$HOST_PATH" "$STAGING_PATH" "$REMOTE_SUDO" "${TARGETS[@]}" <<'REMOTE_SCRIPT'
set -euo pipefail
ENV_NAME="$1";     shift
TAG="$1";          shift
HOST_PATH="$1";    shift
STAGING_PATH="$1"; shift   # may be empty
SUDO="$1";         shift   # may be empty
TARGETS=("$@")

# If staging is configured, move tarballs into HOST_PATH first.
if [[ -n "$STAGING_PATH" ]]; then
  for svc in "${TARGETS[@]}"; do
    tar="$svc-$TAG.tar.gz"
    echo ">> $SUDO cp $STAGING_PATH/$tar $HOST_PATH/"
    $SUDO cp "$STAGING_PATH/$tar" "$HOST_PATH/"
  done
fi

# Use absolute paths instead of `cd "$HOST_PATH"` because the SSH user may
# not have read/execute on HOST_PATH; only the privileged `$SUDO` commands
# can reach inside it. `--project-directory` keeps compose's `.env` lookup
# and relative-path semantics anchored to HOST_PATH.
COMPOSE=("$SUDO" docker compose --project-directory "$HOST_PATH" -f "$HOST_PATH/docker-compose.yml")

for svc in "${TARGETS[@]}"; do
  tar="$HOST_PATH/$svc-$TAG.tar.gz"
  echo ">> $SUDO docker load < $tar"
  $SUDO docker load < "$tar"

  # Bump every reference to bigcapital-fork-<svc>:<env>-v<N> in compose.
  # The server image is referenced twice (server + database_migration); both update.
  $SUDO sed -i -E "s|bigcapital-fork-${svc}:${ENV_NAME}-v[0-9]+|bigcapital-fork-${svc}:${TAG}|g" "$HOST_PATH/docker-compose.yml"
done

echo ">> ${COMPOSE[*]} up -d --force-recreate ${TARGETS[*]}"
"${COMPOSE[@]}" up -d --force-recreate "${TARGETS[@]}"

# Show what's now running.
"${COMPOSE[@]}" ps
REMOTE_SCRIPT

say "Done. Tag $TAG deployed to $DEPLOY_HOST."
