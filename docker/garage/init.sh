#!/bin/sh
#
# One-time bootstrap for the Garage server, driven over its admin API.
#
# The Garage image ships no shell, so the CLI can only be reached one command
# per container; everything here is plain HTTP instead and runs from any image
# that has curl. The compose files run it as the `garage-init` service.
#
# Required:
#   GARAGE_ADMIN_TOKEN      admin API token, same value the node is given.
#   S3_ACCESS_KEY_ID        credentials the application will use; they are
#   S3_SECRET_ACCESS_KEY    imported, so the .env stays the source of truth.
#
# Optional:
#   GARAGE_ADMIN_URL   default http://garage:3903
#   S3_BUCKET          default bigcapital
#   GARAGE_KEY_NAME    default bigcapital-app
#   GARAGE_LOCAL_ZONE  default dc1
#   GARAGE_CAPACITY    node capacity in bytes, default 10000000000 (10 GB)
#
# Re-running is safe: the layout is applied only when no node has a role yet,
# and an existing key or bucket is left alone.

set -eu

ADMIN_URL="${GARAGE_ADMIN_URL:-http://garage:3903}"
ZONE="${GARAGE_LOCAL_ZONE:-dc1}"
CAPACITY="${GARAGE_CAPACITY:-10000000000}"
BUCKET="${S3_BUCKET:-bigcapital}"
KEY_NAME="${GARAGE_KEY_NAME:-bigcapital-app}"
BODY=/tmp/garage-init-response

fail() {
  echo "garage-init: $1" >&2
  [ -s "$BODY" ] && sed 's/^/garage-init:   /' "$BODY" >&2
  exit 1
}

# Calls the admin API; prints the status code, leaves the body in $BODY.
api() {
  _method="$1"
  _path="$2"
  _body="${3:-}"

  if [ -n "$_body" ]; then
    curl -sS -o "$BODY" -w '%{http_code}' -X "$_method" \
      -H "Authorization: Bearer $GARAGE_ADMIN_TOKEN" \
      -H 'Content-Type: application/json' \
      -d "$_body" "$ADMIN_URL$_path"
  else
    curl -sS -o "$BODY" -w '%{http_code}' -X "$_method" \
      -H "Authorization: Bearer $GARAGE_ADMIN_TOKEN" \
      "$ADMIN_URL$_path"
  fi
}

# Reads the first value of a top-level string field out of $BODY.
json_string() {
  tr -d ' \n' <"$BODY" | grep -o "\"$1\":\"[^\"]*\"" | head -n1 | cut -d'"' -f4
}

# Reads the first value of a numeric field out of $BODY.
json_number() {
  tr -d ' \n' <"$BODY" | sed -n "s/.*\"$1\":\([0-9][0-9]*\).*/\1/p" | head -n1
}

[ -n "${GARAGE_ADMIN_TOKEN:-}" ] ||
  fail 'GARAGE_ADMIN_TOKEN is not set; it must match the token given to the node.'
[ -n "${S3_ACCESS_KEY_ID:-}" ] && [ -n "${S3_SECRET_ACCESS_KEY:-}" ] ||
  fail 'S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be set; they are imported into Garage.'

echo "garage-init: waiting for the admin API at $ADMIN_URL"
attempt=0
while [ "$attempt" -lt 60 ]; do
  if [ "$(api GET /v1/status || true)" = "200" ]; then
    break
  fi
  attempt=$((attempt + 1))
  sleep 2
done
[ "$(api GET /v1/status || true)" = "200" ] ||
  fail "the admin API never answered at $ADMIN_URL"

NODE_ID=$(json_string id)
[ -n "$NODE_ID" ] || fail 'could not read the node id from the cluster status.'

# The cluster layout. Until a node holds a role the ring is not ready and every
# read and write is dropped, which is what an unbootstrapped Garage looks like.
[ "$(api GET /v1/layout)" = "200" ] || fail 'could not read the cluster layout.'

if tr -d ' \n' <"$BODY" | grep -q '"roles":\[\]'; then
  VERSION=$(json_number version)
  echo "garage-init: assigning node ${NODE_ID} to zone ${ZONE} with ${CAPACITY} bytes"

  [ "$(api POST /v1/layout \
    "[{\"id\":\"$NODE_ID\",\"zone\":\"$ZONE\",\"capacity\":$CAPACITY,\"tags\":[]}]")" = "200" ] ||
    fail 'could not stage the layout change.'

  [ "$(api POST /v1/layout/apply "{\"version\":$((VERSION + 1))}")" = "200" ] ||
    fail 'could not apply the layout.'

  echo "garage-init: layout applied at version $((VERSION + 1))"
else
  echo 'garage-init: the layout is already applied, leaving it alone'
fi

# The access key. Importing rather than creating keeps the .env authoritative,
# so nothing has to be copied back out of the container.
case "$(api POST /v1/key/import \
  "{\"accessKeyId\":\"$S3_ACCESS_KEY_ID\",\"secretAccessKey\":\"$S3_SECRET_ACCESS_KEY\",\"name\":\"$KEY_NAME\"}")" in
200) echo "garage-init: imported key ${S3_ACCESS_KEY_ID}" ;;
409) echo "garage-init: key ${S3_ACCESS_KEY_ID} already exists" ;;
*) fail "could not import the key ${S3_ACCESS_KEY_ID}." ;;
esac

# The bucket.
case "$(api POST /v1/bucket "{\"globalAlias\":\"$BUCKET\"}")" in
200) echo "garage-init: created bucket ${BUCKET}" ;;
409) echo "garage-init: bucket ${BUCKET} already exists" ;;
*) fail "could not create the bucket ${BUCKET}." ;;
esac

[ "$(api GET "/v1/bucket?globalAlias=$BUCKET")" = "200" ] ||
  fail "could not read the bucket ${BUCKET}."
BUCKET_ID=$(json_string id)
[ -n "$BUCKET_ID" ] || fail "could not read the id of the bucket ${BUCKET}."

# The grant, which is what the application's uploads actually need.
[ "$(api POST /v1/bucket/allow \
  "{\"bucketId\":\"$BUCKET_ID\",\"accessKeyId\":\"$S3_ACCESS_KEY_ID\",\"permissions\":{\"read\":true,\"write\":true,\"owner\":true}}")" = "200" ] ||
  fail "could not grant ${S3_ACCESS_KEY_ID} access to ${BUCKET}."

echo "garage-init: ${S3_ACCESS_KEY_ID} can read and write ${BUCKET}; Garage is ready"
