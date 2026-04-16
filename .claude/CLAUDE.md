# Claude Code Settings for Bigcapital

## Node.js Version

Always use Node.js 18.16.1 for this project. Before running any npm/pnpm/node commands:

```bash
nvm use 18.16.1
```

## Package Manager

Use `pnpm` for this project.

## Fork-Specific Changes

This fork diverges from upstream `bigcapitalhq/bigcapital` in the following areas. Keep these in mind when reviewing upstream PRs or merging.

### Features added in this fork

- **Bulk activate/inactivate accounts** — `POST /accounts/bulk-activate` and `POST /accounts/bulk-inactivate` endpoints + webapp UI (alert dialogs with correct selected count).
- **Edit categorization on bank transactions** — `PATCH /banking/categorize/:id` allows changing `creditAccountId`, `transactionType`, and `description` on categorized transactions without uncategorize/re-categorize. Rewrites GL entries when account or type changes. Webapp "Edit Category" context menu item opens a dialog.
- **Parent account name + code in CSV export** — `parentAccountName` and `parentAccountCode` computed attributes in `AccountTransformer`, exposed via `Account.meta.ts` columns.
- **Accounts import: parent-child resolution** — Two-pass import via `afterImport()` hook on the `Importable` base class. `AccountsImportable` strips `parentAccountId` during creation and resolves parent relationships after all accounts exist in the transaction.
- **Stripped seed accounts** — `SeedAccounts` array contains only predefined (required) accounts. Non-essential defaults removed. Drawings code changed from 30003 to 30004 to avoid duplicate with Owner's Equity.

### Bugs fixed in this fork

- **Redis config permissions** — `COPY --chown=redis:redis` in Redis Dockerfile.
- **Migration path** — `working_dir: /app/packages/server` in compose so system migration directory resolves correctly.
- **Empty email verification token** — `AuthMailSubscriber` skips sending verification email when `SIGNUP_EMAIL_CONFIRMATION=false` (token is empty).
- **Import preview auto-refresh** — `staleTime: Infinity` and `refetchOnWindowFocus: false` on import preview/meta queries. Added missing `Account` case to `invalidateResourcesOnImport()`.
- **UI label inconsistencies** — Standardized "Statement"→"Note", "Reference #"→"Reference No.", date/account field capitalization, "Full Amount"→"Amount", credit note using invoice date label, vendor credit using bill date label, withdrawal account mislabeled as deposit account.

### Conventions for this fork

- **Container/image naming**: Use `bigcapital-fork-*` prefix for container names and `bigcapital-fork-*:uat-v*` for image tags to avoid collisions with upstream instances.
- **Network naming**: Internal network is `bigcapital_fork_network`, volumes are `bigcapital_prod_fork_*`.
- **i18n labels**: Use Title Case for all column headers and form labels (e.g. "Payment Date", not "Payment date"). Use "Note" not "Statement" for memo fields. Use "Reference No." consistently.

## Deployment

Production and UAT instances run in Docker via `docker-compose.prod.yml`. Traefik sits in front of everything as the reverse proxy, handling TLS termination, OAuth forward-auth, and routing between `server` (NestJS API) and `webapp` (Vite SPA).

See `docs/DEPLOY.md` for the full deployment guide including image build, transfer, Traefik config, environment setup, and troubleshooting.

### Key deployment notes

- **Migration working directory** must be `/app/packages/server` — the system migration path (`./src/database/system/migrations`) is relative to `cwd`.
- **MySQL grants**: The MariaDB init script only runs on first database initialization. If the volume pre-exists, manually grant `ALL PRIVILEGES ON *.*` to the app user.
- **API rate limit**: Default `120,60,600` is too aggressive for SPA usage. Use `600,60,60` or higher. State is stored in Redis — restart Redis to clear lockouts.
- **Fonts**: NotoSans and Segoe font files must be in `packages/webapp/public/fonts/` for production builds (Vite's SCSS URL resolution doesn't hash them).
- **GOTENBERG_DOCS_URL**: Uses container name `http://bigcapital-fork-server:3000/public/` — must match the `container_name` in compose.

### Traefik configuration style

- **Dynamic files**, not Docker labels. Routers, services, and middlewares live in `*.yml` under Traefik's watched directory (commonly `/etc/traefik/dynamic/`). Do NOT add `traefik.*` labels to the compose file.
- Bigcapital containers must attach to Traefik's external network. Declare it as `external: true` in the compose file's `networks:` block and attach `server` and `webapp`. Keep `mysql`, `redis`, `gotenberg`, and `database_migration` on the internal network only.
- Container names drive dynamic-file service URLs. Keep the `container_name:` entries in compose stable.

### Routing split

Same host, path-prefix routing. Two routers, explicit priority so the API router beats the bare-Host webapp router:

- `bigcapital-fork-api` (priority 10): `Host(host) && (PathPrefix('/api') || PathPrefix('/socket') || PathPrefix('/public'))` → `bigcapital-fork-server:3000`
- `bigcapital-fork-webapp` (priority 1): `Host(host)` (catch-all for the SPA) → `bigcapital-fork-webapp:80`

The API service needs sticky cookies for Socket.IO correctness under replica scale-out.

### OAuth pattern — network-level gate, internal auth untouched

UAT and prod use OAuth forward-auth at the Traefik edge. The intent is **network-level access control**, not identity federation:

- OAuth wraps both routers. Unauthenticated requests get redirected to the OAuth provider.
- Bigcapital's internal `AuthModule` (JWT signin/signup/password-reset) remains the source of truth for user identity. OAuth and internal auth are separate layers.
- Users experience two logins: OAuth once per browser session, Bigcapital signin once per JWT lifetime (1 day).

### Future enhancement: multi-organization support per user

**Scenario:** One person managing books for multiple companies needs to use the same email across different organizations and switch between them.

**Current limitation:** The system is 1 user = 1 tenant. Email uniqueness is enforced globally (`AuthSignup.validateEmailUniqiness` queries without tenant filter). Signin returns the first email match. JWT contains only email (`sub`), no `tenantId`. No org-switching mechanism exists.

**Recommended approach (Approach A — per-tenant email uniqueness):**
1. DB migration: composite unique constraint `(email, tenant_id)` on system `USERS` table
2. `AuthSignup.validateEmailUniqiness` — filter by `tenantId`, not global
3. `AuthSignin` — when email matches multiple tenants, return org list for user to pick
4. JWT payload — add `tenantId` alongside `sub` (email)
5. JWT verification (`AuthJwtStrategy`) — look up user by email + tenantId, not just email
6. Webapp login flow — add org selection step when ambiguous

**Key files:** `AuthSignup.service.ts`, `AuthSignin.service.ts`, `Auth.interfaces.ts` (JwtPayload), `AuthJwtStrategy.ts`, `SystemUser.ts`, system DB migrations, webapp login components.

**Alternative (Approach B — junction table):** Create `user_tenants` table, single user identity across orgs, switch from a menu. More correct but far more invasive — touches every user-tenant query.

### Known UAT/deploy-time gaps (deliberate follow-up work)

Behavioral hardening patterns are scaffolded but not wired at their emit sites, due to a `git reset --hard` mishap. Subscribers are live; upstream `eventEmitter.emit(...)` calls still need reconstruction:

- `AuthSigninService` — `events.auth.loginFailed` emit + timing-equalize with `DUMMY_HASH`
- `GenerateApiKey` — `events.apiKey.{created,revoked}` emits + tenant-scoped revoke
- `PlaidItem` — `$beforeInsert`/`$beforeUpdate` encryption lifecycle hooks
- `Attachments` — `@Throttle` on upload, sanitize-filename, tenant-scope IDOR checks
- `CommandAccountValidators` — posting-history check on account-type changes
- `AuthMail.subscriber` — include `email=...` in failure log
- `AuthAuditSubscriber.onLoginFailed` — strip `reason` and `userId` from audit payload

UAT functional testing does NOT catch the absence of these items. Plan a dedicated session to reconstruct before production data.
