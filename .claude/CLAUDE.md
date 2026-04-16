# Claude Code Settings for Bigcapital

## Node.js Version

Always use Node.js 18.16.1 for this project. Before running any npm/pnpm/node commands:

```bash
nvm use 18.16.1
```

## Package Manager

Use `pnpm` for this project.

## Deployment

Production and UAT instances run in Docker via `docker-compose.prod.yml`. Traefik sits in front of everything as the reverse proxy, handling TLS termination, OAuth forward-auth, and routing between `server` (NestJS API) and `webapp` (Vite SPA). The envoy `proxy:` service in `docker-compose.prod.yml` is an older alternative and is NOT used when Traefik is the ingress — delete it from the deployed compose file and drop the `80:80` / `443:443` port mappings. Traefik owns those.

### Traefik configuration style

- **Dynamic files**, not Docker labels. Routers, services, and middlewares live in `*.yml` under Traefik's watched directory (commonly `/etc/traefik/dynamic/`). Do NOT add `traefik.*` labels to the compose file — they'll be ignored and cause confusion.
- Bigcapital containers must attach to Traefik's external network (name varies by installation — common values: `traefik_public`, `traefik`, `web`). Declare it as `external: true` in the compose file's `networks:` block and attach both `server` and `webapp`. Leave `mysql`, `redis`, `gotenberg`, and `database_migration` on the internal `bigcapital_network` only — they must not be reachable from Traefik.
- Container names drive dynamic-file service URLs: `http://bigcapital-server:3000` and `http://bigcapital-webapp:80`. Keep the `container_name:` entries in compose stable.

### Routing split

Same host, path-prefix routing. Two routers, explicit priority so the API router beats the bare-Host webapp router:

- `bigcapital-api` (priority 10): `Host(host) && (PathPrefix('/api') || PathPrefix('/socket') || PathPrefix('/public'))` → `bigcapital-server:3000`
- `bigcapital-webapp` (priority 1): `Host(host)` (catch-all for the SPA) → `bigcapital-webapp:80`

Include `/socket` (WebSocket upgrade for Socket.IO) and `/public` (static assets the server serves; Gotenberg fetches from `GOTENBERG_DOCS_URL=http://server:3000/public/` in-network, browsers hit it via the public route). Omit `/queues` (Bull Board) unless you explicitly want the queue dashboard public — if so, gate it with a restrictive forward-auth middleware on its own dedicated router.

The API service needs sticky cookies (`sticky.cookie` on the loadBalancer) for Socket.IO correctness under replica scale-out. Harmless on a single replica.

### OAuth pattern — network-level gate, internal auth untouched

UAT and prod use OAuth forward-auth (oauth2-proxy, Authelia in OAuth mode, etc.) at the Traefik edge. The intent is **network-level access control**, not identity federation:

- OAuth wraps both routers (`bigcapital-api` and `bigcapital-webapp`). Unauthenticated requests get redirected to the OAuth provider.
- Bigcapital's internal `AuthModule` (JWT signin/signup/password-reset, bcrypt-hashed users in `bigcapital_system.USERS`) remains the source of truth for user identity. OAuth and internal auth are separate layers — no federation, no auto-provisioning.
- Users experience two logins: OAuth once per browser session, Bigcapital signin once per JWT lifetime (1 day). Acceptable friction for internal UAT testers; weird for public-facing prod.
- `/api/auth/signin` POSTs work through OAuth because the browser carries the OAuth session cookie alongside the credentials payload. As long as the forward-auth middleware verifies the session and passes the request upstream (rather than 302-redirecting on `POST`), the flow works. If signin returns a 302 to the OAuth provider instead of a JSON response, the middleware config needs adjustment.

**Paths that need OAuth exemption** — only if UAT/prod exercises them; otherwise leave OAuth wrapping everything:

- `/api/webhooks/stripe` — Stripe retries without an OAuth cookie
- `PLAID_LINK_WEBHOOK` path — same story for Plaid
- LemonSqueezy webhook path — same story
- `/reset_password/:token` — emailed password-reset link; the clicker may not have an active OAuth session
- `/api/invite/accept/:token`, `/api/invite/check/:token` — public invite-acceptance landing pages

Implement exemptions as a separate higher-priority router (priority 100) with the same `bigcapital-api` service but no OAuth middleware.

### Environment variables

- Remove `PUBLIC_PROXY_PORT` and `PUBLIC_PROXY_SSL_PORT` from `.env` — those belonged to the envoy `proxy:` service. Traefik owns the edge ports.
- `BASE_URL=https://uat.yourdomain.com` (or prod domain). Used by outbound email links (password-reset, signup-verify) and the Plaid webhook callback URL. Wrong value = users get links to `http://example.com`.
- `GOTENBERG_URL=http://gotenberg:3000` and `GOTENBERG_DOCS_URL=http://server:3000/public/` stay as docker-compose service-name URLs — these are internal, not routed through Traefik.
- `FIELD_ENCRYPTION_KEY` — 32 bytes hex from `openssl rand -hex 32`. Set on first deploy; rotation requires a re-encryption migration.
- `AUDIT_LOG_ENABLED=true`, `AUDIT_LOG_RETENTION_DAYS=180`, `SYSTEM_ADMIN_EMAILS=...` — audit-log module config. `SYSTEM_ADMIN_EMAILS` is fail-closed; empty allowlist = nobody can hit `/api/system-audit-logs`.

### Trusted proxy headers

NestJS sees traffic sourced from Traefik's container, not from the real client, unless `X-Forwarded-For` is honored. For accurate `IP` values in audit-log rows, the app needs either `app.set('trust proxy', ...)` in `main.ts` or the `user-ip.interceptor.ts` to explicitly read the forwarded header. Verify this before relying on audit-log IP for forensics.

### Verification checklist after bring-up

- `curl -s http://<traefik-host>:8080/api/rawdata | jq '.routers | keys[]'` → includes `bigcapital-api@file` and `bigcapital-webapp@file` (both with `@file` suffix confirming they came from the dynamic file provider, not labels).
- `curl -sv https://host/` → 200, `Content-Type: text/html` (SPA).
- `curl -sv https://host/api/auth/meta` → 200, `Content-Type: application/json` (API, correct priority routing).
- Open webapp in a browser, confirm Network → WS tab shows `/socket/` upgrading to 101.
- `openssl s_client -connect host:443` → certificate from the expected issuer, valid dates.
- First signup → check `SYSTEM_AUDIT_LOGS` for `action='auth.signup.completed'` row. If empty, audit-log subscriber chain is broken.

### Image build and deploy

- Build from `develop` tip AFTER all four PRs (#1-#4 from the regression-testing + reconstruction session) are merged. Without PR #4 + PR #2 together the server TS build fails on `MAP_CONFIG.pathFormat` and `registerAs(resetPasswordSeconds)`.
- `docker-compose.prod.yml` ships with `image: bigcapitalhq/server:latest` and `image: bigcapitalhq/webapp:latest`. Either retag your build locally (`docker tag your-registry/bigcapital-server:tag bigcapitalhq/server:latest`) or edit the compose file to reference your tags. Retagging is fragile if someone runs `docker compose pull` — editing is more permanent.
- Server image runs at `/app` with `CMD ["node", "packages/server/dist/main.js"]`. Smoke test before deploy: `docker run --rm -e DB_HOST=invalid -e S3_BUCKET=smoke -e JWT_SECRET=x -e REDIS_HOST=invalid ...image...` — should log the Nest boot sequence including `RoutesResolver AuditLogController /api/audit-logs` before the external-connection failure.

### Known UAT/deploy-time gaps (deliberate follow-up work)

Behavioral hardening patterns documented in this file's "Code Patterns" and "Security & Audit" sections are scaffolded but not wired at their emit sites, due to a `git reset --hard` mishap that destroyed the service-code modifications. Subscribers are live; upstream `eventEmitter.emit(...)` calls in the following services still need reconstruction before any real customer data hits the instance:

- `AuthSigninService` — `events.auth.loginFailed` emit + timing-equalize with `DUMMY_HASH`
- `GenerateApiKey` — `events.apiKey.{created,revoked}` emits + tenant-scoped revoke `.patch({revokedAt}).where({id, tenantId})`
- `PlaidItem` — `$beforeInsert`/`$beforeUpdate` encryption lifecycle hooks + `PlaidAccessTokenDecryptError` typed error class
- `Attachments` controller and services — `@Throttle` on upload, sanitize-filename split, `Document`-row tenant-scope check before S3 access, IDOR `.warn` logs
- `CommandAccountValidators` — posting-history check on account-type changes (zero rows in `accounts_transactions`)
- `AuthMail.subscriber` — include `email=...` in failure log
- `AuthAuditSubscriber.onLoginFailed` — strip `reason` and `userId` from audit payload (no enumeration signal)

UAT functional testing does NOT catch the absence of these items. Plan a dedicated session to reconstruct before production data.
