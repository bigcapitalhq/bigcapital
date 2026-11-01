#!/usr/bin/env bash
#
# One-time bootstrap for the Garage server.
#
# Run inside the running container:
#   docker compose exec server bash /garage-setup/setup.sh
#   (or: docker compose exec garage bash /garage-setup/setup.sh)
#
# Prerequisites (set in the compose file / .env):
#   GARAGE_RPC_SECRET   must match the node's RPC secret.
#   GARAGE_ADMIN_TOKEN  admin API token (also used by the CLI).
#   S3_BUCKET           bucket to create (defaults to "bigcapital").
#
# The script is idempotent: re-running it on an already configured
# cluster is a no-op.

set -euo pipefail

GARAGE_LOCAL_ZONE="${GARAGE_LOCAL_ZONE:-dc1}"
GARAGE_CAPACITY="${GARAGE_CAPACITY:-10G}"
S3_BUCKET="${S3_BUCKET:-bigcapital}"

if command -v garage >/dev/null 2>&1; then
  GARAGE_BIN="garage"
elif [ -x /garage ]; then
  GARAGE_BIN="/garage"
else
  echo "ERROR: could not find the 'garage' CLI in PATH or at /garage." >&2
  exit 1
fi

echo "==> Waiting for the Garage node to answer on the RPC/admin endpoints..."
for _ in $(seq 1 30); do
  if ${GARAGE_BIN} status >/dev/null 2>&1; then
    break
  fi
  sleep 2
done
if ! ${GARAGE_BIN} status >/dev/null 2>&1; then
  echo "ERROR: Garage did not become reachable. Is the daemon running?" >&2
  exit 1
fi

NODE_ID=$(${GARAGE_BIN} node id 2>/dev/null | awk 'NR==1{print $1}')
if [ -z "${NODE_ID}" ]; then
  echo "ERROR: could not determine the node id (garage node id)." >&2
  exit 1
fi

# Apply the cluster layout only when the node is not part of a live layout yet.
if ${GARAGE_BIN} status | grep -q "Healthy"; then
  echo "==> Node is already part of a healthy layout, skipping layout assignment."
else
  echo "==> Assigning cluster layout (node ${NODE_ID}, zone ${GARAGE_LOCAL_ZONE}, capacity ${GARAGE_CAPACITY})..."
  # 'assign' fails harmlessly if already assigned; 'apply' fails harmlessly if nothing is staged.
  ${GARAGE_BIN} layout assign "${NODE_ID}" -z "${GARAGE_LOCAL_ZONE}" -c "${GARAGE_CAPACITY}" >/dev/null 2>&1 || true
  ${GARAGE_BIN} layout apply --version 1 >/dev/null 2>&1 || ${GARAGE_BIN} layout apply >/dev/null 2>&1 || true

  echo "==> Waiting for the cluster to become healthy..."
  for _ in $(seq 1 30); do
    if ${GARAGE_BIN} status | grep -q "Healthy"; then
      break
    fi
    sleep 2
  done
  ${GARAGE_BIN} status | grep -q "Healthy" || {
    echo "ERROR: Garage did not become healthy. Inspect: ${GARAGE_BIN} status" >&2
    exit 1
  }
fi

# Access key (idempotent).
if ${GARAGE_BIN} key list | grep -qw bigcapital; then
  echo "==> Access key 'bigcapital' already exists, reusing it."
  KEY_ID=$(${GARAGE_BIN} key info bigcapital | awk '/Key ID/{print $NF}' | head -n1)
  SECRET_KEY=""
else
  echo "==> Creating access key 'bigcapital'..."
  OUT=$(${GARAGE_BIN} key create --name bigcapital)
  KEY_ID=$(echo "${OUT}" | awk '/Key ID/{print $NF}' | head -n1)
  SECRET_KEY=$(echo "${OUT}" | awk '/Secret key/{print $NF}' | head -n1)
  echo "    Key ID: ${KEY_ID}"
fi

# Bucket (idempotent).
if ${GARAGE_BIN} bucket list | grep -qw "${S3_BUCKET}"; then
  echo "==> Bucket '${S3_BUCKET}' already exists, skipping."
else
  echo "==> Creating bucket '${S3_BUCKET}'..."
  ${GARAGE_BIN} bucket create "${S3_BUCKET}"
fi

# Allow the key to read/write the bucket.
echo "==> Allowing key 'bigcapital' on bucket '${S3_BUCKET}'..."
${GARAGE_BIN} bucket allow --read --write --owner --key bigcapital --bucket "${S3_BUCKET}"

echo ""
echo "================================================================"
echo " Garage is ready. Add the following to your .env file:"
echo "================================================================"
echo "S3_REGION=garage"
if [ -n "${SECRET_KEY:-}" ]; then
  echo "S3_ACCESS_KEY_ID=${KEY_ID}"
  echo "S3_SECRET_ACCESS_KEY=${SECRET_KEY}"
else
  echo "S3_ACCESS_KEY_ID=${KEY_ID}"
  echo "S3_SECRET_ACCESS_KEY= (get the secret with: garage key info bigcapital)"
fi
echo "S3_ENDPOINT=http://garage:3900"
echo "S3_BUCKET=${S3_BUCKET}"
echo "S3_FORCE_PATH_STYLE=true"
echo "================================================================"