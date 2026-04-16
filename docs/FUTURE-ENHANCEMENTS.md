# Future Enhancements

Planned improvements and feature requests for this Bigcapital fork, documented with enough context to pick up without prior conversation.

---

## Multi-Organization Support Per User

**Priority:** High
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

---

## Behavioral Hardening (Security/Audit Wiring)

**Priority:** High — must be completed before production data

Behavioral hardening patterns are scaffolded (subscribers are live) but upstream `eventEmitter.emit(...)` calls are missing at emit sites, due to a `git reset --hard` mishap. These items need reconstruction:

- `AuthSigninService` — `events.auth.loginFailed` emit + timing-equalize with `DUMMY_HASH`
- `GenerateApiKey` — `events.apiKey.{created,revoked}` emits + tenant-scoped revoke
- `PlaidItem` — `$beforeInsert`/`$beforeUpdate` encryption lifecycle hooks
- `Attachments` — `@Throttle` on upload, sanitize-filename, tenant-scope IDOR checks
- `CommandAccountValidators` — posting-history check on account-type changes
- `AuthMail.subscriber` — include `email=...` in failure log
- `AuthAuditSubscriber.onLoginFailed` — strip `reason` and `userId` from audit payload

UAT functional testing does NOT catch the absence of these items.
