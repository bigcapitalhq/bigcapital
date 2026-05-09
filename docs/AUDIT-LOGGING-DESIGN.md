# Audit Logging — Design Doc

Status: **implemented (2026-04) — keep this doc as the design-of-record**

Implementation landed in 6 sub-PRs (4.1 schema/write, 4.2 subscribers, 4.3 new emits, 4.4 `api_key.used` batching, 4.5 retention crons, 4.6 read API). See `SECURITY-AUDIT.md` → "Batch 4" for the merge log. Update this doc before changing the schema, retention policy, or scope split.
Owner: security hardening track (Batch 4)
Related: `SECURITY-AUDIT.md`

## Motivation

The security review surfaced a gap: no persistent audit trail for sensitive actions. PostHog captures product analytics but is (a) external, (b) sampled/dropped under load, (c) not queryable by support/compliance, and (d) deliberately stripped of PII. For forensics we need a durable, queryable, server-authoritative log of who did what and when.

**Out of scope for v1**: tamper-evidence (hash chaining), SIEM forwarding, user-facing audit UI. The schema supports these later; v1 is write + query.

## Schema

Tenant DB, new table `audit_logs`:

| Column          | Type          | Notes |
|-----------------|---------------|-------|
| `id`            | `bigIncrements` | |
| `user_id`       | `int` (null)  | Actor. Null for unauthenticated events (failed login by unknown email). |
| `action`        | `string(64)`  | Dotted event name, e.g. `auth.login.success`, `api_key.created`. |
| `resource_type` | `string(64)` (null) | Objection model name when relevant (`SaleInvoice`, `ApiKey`). |
| `resource_id`   | `string(64)` (null) | Stringified so polymorphic IDs (UUID, number) work. |
| `metadata`      | `json` (null) | Bounded extra context (max 4 KB, see Redaction). |
| `ip`            | `string(45)` (null) | IPv4/IPv6. |
| `user_agent`    | `string(255)` (null) | |
| `created_at`    | `timestamp`, indexed | Range queries + retention sweep. |

Indexes: `created_at`, `(user_id, created_at)`, `(action, created_at)`.

**Split across two tables**:
- Tenant-scoped events (invoice voided, role assigned, plaid linked, stripe webhook) → `audit_logs` in tenant DB.
- System-scoped events that happen *before* a tenant is selected (login success/failure, signup, password reset, email verification, API key create/use) → `system_audit_logs` in system DB. Schema identical except `tenant_id` column is added (nullable; set when the event is attributable to a tenant, null for pre-tenant-selection events like failed login).

This keeps tenant data portable (export/delete respects GDPR), while ensuring auth events that don't yet have a tenant aren't dropped.

**Why `action` as a string, not an enum**: new auditable events get added often; an enum column requires a migration each time. A central `AuditAction` TypeScript union provides type-safety at the call site without locking the column.

## Events to log (v1)

Driven by existing `@nestjs/event-emitter` events where possible — one interceptor, many sources.

| Category | Action | Emitted from | Success? Failure? |
|---|---|---|---|
| Auth | `auth.login.success` | `events.auth.signIn` | success only (login failures go through `auth.login.failed` from a guard hook) |
| Auth | `auth.login.failed` | new hook in `AuthSignin.service.ts` catch block | |
| Auth | `auth.password_reset.requested` | `events.auth.sendResetPassword` | |
| Auth | `auth.password_reset.completed` | `events.auth.resetPassword` | |
| Auth | `auth.signup.completed` | `events.auth.signUp` | |
| Auth | `auth.email_verified` | `events.auth.signUpConfirmed` | |
| Users | `user.invited` | `events.inviteUser.sendInvite` | |
| Users | `user.invite_accepted` | `events.inviteUser.acceptInvite` | |
| Users | `user.deactivated` / `user.activated` | existing events in `UsersModule` | |
| Users | `user.deleted` | existing event | |
| API keys | `api_key.created` | new event in `GenerateApiKey.service.ts` | |
| API keys | `api_key.revoked` | new event | |
| API keys | `api_key.used` | `ApiKeyStrategy` validate hook | **every request** — see performance notes below |
| Payments | `stripe.checkout_completed` | `events.stripeWebhooks.onCheckoutSessionCompleted` | |
| Payments | `stripe.account_updated` | `events.stripeWebhooks.onAccountUpdated` | |
| Plaid | `plaid.item_created` | `events.plaid.onItemCreated` | |
| Plaid | `plaid.item_removed` | existing event | |
| Permissions | `role.assigned` / `role.revoked` | tenant user role change events | |

About 15 event types. Each maps to a dedicated subscriber in a new `AuditLogModule`; each subscriber is ~10 lines. No call-site instrumentation for these.

Sensitive non-event paths (things that *aren't* emitted as events today) get a manual `auditLog.record(...)` call:
- API key creation & revocation (new event first, then subscriber)
- Failed login attempts (new hook in signin catch block)

## Redaction rules

Must-never-log: passwords, password hashes, reset tokens, verify tokens, Plaid access tokens, API key plaintext, full card numbers, OAuth tokens.

Implementation: `AuditLogService.record()` runs every `metadata` object through a recursive key allowlist. Keys matching `/password|token|secret|key|hash|cvv|pin/i` get replaced with `[REDACTED]`. Values longer than 1 KB get truncated with `...(truncated)`. Total JSON payload capped at 4 KB — reject with a warning log if over.

Email addresses in metadata are allowed (they're often the subject of the action). Full names are allowed. No SSNs, tax IDs, or card data flow through this path in the current codebase; if they do later, extend the allowlist test.

## Retention

Default **180 days**, configurable per tenant via a `audit_log_retention_days` column on the `tenants` table (system DB). `0` or null = use default.

Two sweep jobs:
- `AuditLogCleanupJob` — `@Cron(EVERY_DAY_AT_2AM)` — iterates tenants with **bounded parallelism** (`TENANT_SWEEP_CONCURRENCY = 8` via `Promise.all` over slices). Each tenant uses a short-lived Knex connection and runs a **chunked DELETE** (`DELETE ... WHERE created_at < cutoff LIMIT 10_000`, looped until a chunk returns short). Chunking bounds per-statement lock time and binlog growth — a large first-run backlog drains across many small statements instead of one table-locking DELETE.
- `SystemAuditLogCleanupJob` — same schedule — single `DELETE` against `system_audit_logs`, using the global default (180d). System events aren't per-tenant so retention is global. Volume on this table is lower (one row per auth event, not per API request) so chunking isn't required.

**Why 180 days default**: covers most incident-response windows including slow-moving financial/compliance investigations, while still bounding table growth.

## Implementation pattern

- **Module**: `modules/AuditLog/` — models, service, cleanup jobs, read controller, and subscribers for each event category (one file per category: `AuthAudit.subscriber.ts`, `UserAudit.subscriber.ts`, etc).
- **Service**: `AuditLogService.record({ action, userId, resourceType, resourceId, metadata, scope })` where `scope: 'tenant' | 'system'` picks the destination table. Reads `req` from CLS to pull `ip`, `user_agent`, and `user_id` defaults.
- **Models**: `AuditLog` (tenant-scoped via `TenantModelProxy`) and `SystemAuditLog` (system-scoped Objection model).
- **Migrations**:
  - `packages/server/src/database/tenant/migrations/<ts>_create_audit_logs_table.ts`
  - `packages/server/src/database/system/migrations/<ts>_create_system_audit_logs_table.js`
  - `packages/server/src/database/system/migrations/<ts>_add_audit_log_retention_to_tenants.js`
- **Read API**: `GET /api/audit-logs` (tenant-scoped, returns `audit_logs`) and `GET /api/system-audit-logs` (admin-only via role guard, returns `system_audit_logs`). Both paginated, filterable by `action`, `userId`, `createdAt` range. CASL ability `read AuditLog` gates tenant route; a new `SystemAdmin` role gates the system route. Returns redacted metadata (same redaction rules as write).
- **Test**: `AuditLog.service.spec.ts` covers redaction and oversize payload rejection. One integration test per subscriber category. Read-API tests verify pagination, filter, and role-guard rejection.

## Performance note — `api_key.used` on every request

Writing a row on the hot path of every API-key-authenticated request adds a DB round-trip per request. Options considered:
1. **Synchronous insert per request** — simplest but adds ~2-5ms latency and contends on the `system_audit_logs` write path under load.
2. **Enqueue to BullMQ, worker writes in batches** — chosen. The `AuditLogService` already buffers `api_key.used` events into a BullMQ queue (`AuditLogBatchQueue`); a processor drains and bulk-inserts every 5s or 500 events, whichever first. Other event types stay synchronous (they're low-frequency).
3. Log only on key ID change per minute per key — rejected; misses repeated replay.

With batching, the steady-state cost is one bulk insert per 5s even at high key-auth rates. If Redis is down, the batch falls through to a synchronous write (degraded mode).

### Buffer hardening (post-implementation, added after quality review)

As implemented, the in-process buffer handles three edge cases the original design didn't spell out:

1. **Shutdown**: `onModuleDestroy` tracks the currently-running flush via `this.inflight` and awaits it before the final flush. Without this, a flush racing with shutdown could lose its batch.
2. **Backpressure**: a hard cap (`AUDIT_LOG_BUFFER_HARD_CAP = 10_000`, ~20× the normal batch) drops events past the cap with a counter log. Prevents memory exhaustion when Redis and DB are both unreachable.
3. **Size-triggered flush during in-flight flush**: the re-entrancy guard used to make these a silent no-op, relying on the 5-second interval to catch up. The buffer now sets `pendingChainedFlush = true` and kicks a follow-up flush as soon as the in-flight one completes, so burst traffic drains at DB/Redis throughput rather than waiting a full interval.

**Two flush methods, not one** (refactored from an earlier `flush(preferDirectWrite)` boolean-flag shape):
- `flush()` — BullMQ-preferred; on enqueue failure, falls through to direct bulk insert. Called by the interval timer and the size-triggered `scheduleFlush()`.
- `flushDirect()` — synchronous bulk insert only; never touches Redis. Called exclusively from `onModuleDestroy()` to avoid a teardown-time Redis dependency.

Both share a `runFlush(writer)` helper that drains the buffer, snapshots the dropped-event counter, and catches terminal errors. Splitting what was previously a boolean-flag method made each path single-purpose and the call sites self-documenting about which semantics they need.

## Read API shape

```
GET /api/audit-logs?action=auth.login.failed&userId=42&from=2026-01-01&to=2026-02-01&page=1&pageSize=50
  200 → { data: AuditLog[], pagination: { page, pageSize, total } }

GET /api/system-audit-logs?... (admin only)
```

Filters: `action` (exact), `userId`, `resourceType`, `resourceId`, `from`, `to`. Ordered by `created_at DESC`. Pagination bounded: `pageSize ≤ 100`.

**Pagination cost note**: the implementation uses Objection's `.page(n, size)`, which issues a separate `SELECT COUNT(*)` to populate `total` alongside the windowed result. At expected volumes this is acceptable, but once an endpoint's observed p95 exceeds ~300 ms, migrate to cursor-based pagination keyed on `created_at` (drop `total` from the response in exchange for an infinite-scroll-friendly `nextCursor`). The read service has an inline comment flagging the call site.

**Metadata redaction on read**: `AuditLogReadService.sanitize()` uses `redactStoredMetadata()` rather than `redactMetadata()`. The stored payload is already capped at `MAX_PAYLOAD_BYTES` by the write path, so the read variant skips the `JSON.stringify` + byte-size check and just runs the redaction walk. Defense-in-depth is preserved (historical rows or any write path that bypasses the service still get redacted on the way out).

## Rollout

Single PR, gated behind a feature flag `AUDIT_LOG_ENABLED` (default `true` — we want it on). Can be flipped off without a deploy if it causes unexpected load. Dashboards: add a query panel for audit-log write rate and table size to whatever the team currently uses for DB monitoring.

## Estimate

- Schemas + 3 migrations + 2 models: half day
- Service + redaction + tests: half day
- Subscribers (15 events × ~10 LOC): half day
- Cleanup crons (2) + per-tenant retention column: half day
- New events for API keys + failed login: half day
- **`api_key.used` batching + BullMQ processor: half day** (added from Q3)
- **Read API (2 controllers, role guard, pagination, filters, tests): 1 day** (added from Q4)
- Code review buffer: half day

**~4.5 dev days** (was 3 before Q3 + Q4 additions).

## Decisions locked in

1. Retention default **180 days**, per-tenant overridable via `tenants.audit_log_retention_days`.
2. Separate **`system_audit_logs`** table in the system DB for pre-tenant-selection events; `audit_logs` in each tenant DB for tenant-scoped events.
3. `api_key.used` logged on **every request**, via a BullMQ batch buffer to keep the hot path fast.
4. **Read API** exposed: `GET /api/audit-logs` (tenant, CASL-gated) and `GET /api/system-audit-logs` (admin role required).
