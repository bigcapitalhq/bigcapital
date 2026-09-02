# AGENTS.md

## Repo overview

Bigcapital is a multi-tenant accounting SaaS. pnpm + Lerna monorepo (independent versioning).

| Package | Path | Role |
|---|---|---|
| `@bigcapital/server` | `packages/server` | NestJS API + CLI. Multi-tenant with system DB + per-tenant DBs (MariaDB). Knex migrations, Objection.js ORM. |
| `@bigcapital/webapp` | `packages/webapp` | React SPA. Vite, BlueprintJS, Redux, React Router v5. |
| `@bigcapital/utils` | `shared/bigcapital-utils` | Shared utilities. tsup (CJS + ESM). |
| `@bigcapital/pdf-templates` | `shared/pdf-templates` | PDF invoice/estimate templates. Webpack, Storybook. |
| `@bigcapital/email-components` | `shared/email-components` | Email templates (react-email). Vite, Storybook. |
| `@bigcapital/sdk-ts` | `shared/sdk-ts` | TypeScript client generated from OpenAPI spec. |

## Dev setup

1. `cp .env.example .env` (root-level env is the canonical one for local dev)
2. `docker compose up -d` — starts MariaDB (3306), Redis (6379), Gotenberg (9000), Garage/S3 (3900)
3. `pnpm install`
4. `pnpm run build:server` — **must run before migrations** (server CLI depends on built output)
5. `pnpm run system:migrate:latest` — system DB
6. `pnpm run server:start` — NestJS on `:3000` (watch mode)
7. `pnpm run dev:webapp` — Vite on `:4000`, proxies `/api` and `/socket` to `:3000`

## Common commands

Run from repo root unless noted.

| What | Command |
|---|---|
| Install deps | `pnpm install` |
| Start server (watch) | `pnpm run server:start` |
| Start webapp (Vite, port 4000) | `pnpm run dev:webapp` |
| Build server + shared deps | `pnpm run build:server` |
| Build all shared packages | `pnpm run build:shared` |
| Build everything | `pnpm run build` |
| Typecheck all packages | `pnpm run typecheck` |
| Lint all | `pnpm run lint` (fix) / `pnpm run lint:check` (check only) |
| Format all | `pnpm run format` (fix) / `pnpm run format:check` (check only) |
| System DB migrations | `pnpm run system:migrate:latest` |
| Tenant DB migrations | `pnpm run tenants:migrate:latest` |
| Make new system migration | `pnpm run system:migrate:make <name>` |
| Make new tenant migration | `pnpm run tenants:migrate:make <name>` |
| Seed system DB | `pnpm run system:seed:latest` |
| Seed tenant DB | `pnpm run tenants:seed:latest` |
| Regenerate SDK from OpenAPI | `pnpm run generate:sdk-types` |
| Playwright e2e | `pnpm run e2e:webapp` |
| Server unit tests | `cd packages/server && pnpm run test` |
| Server e2e tests | `cd packages/server && pnpm run test:e2e` |

## Key gotchas

- **Build before migrate**: `pnpm run build:server` is required before running any migration CLI commands. The server CLI entry (`src/cli.ts`) is compiled separately via `nest-cli.json` projects config.
- **Dual migration systems**: System DB (`packages/server/src/database/system/`) and tenant DB (`packages/server/src/database/tenant/`) have separate migration/seeds directories and separate CLI commands.
- **Server env lives at `packages/server/.env.example`** but for local dev the root `.env` (copied from root `.env.example`) is the primary source. The server `.env.example` documents all available vars.
- **Webapp env prefixes**: Only `VITE_`, `REACT_APP_`, and `PUBLIC_URL` env vars are exposed to the client (see `vite.config.ts`).
- **Server runs on `:3000`**, webapp dev server on `:4000`. The Vite config proxies `/api` and `/socket` to the server.
- **Playwright selectors** use `data-testId` attributes (not `data-testid`). Global setup registers + onboards a test user via API, persists auth to `e2e/.auth/user.json`.
- **Server path alias**: `@/*` maps to `packages/server/src/*` (both in `tsconfig.json` and Jest `moduleNameMapper`).
- **Webapp path alias**: `@` maps to `packages/webapp/src` (Vite resolve alias).
- **Commit linting**: Husky enforces conventional commits via `commitlint` on `commit-msg` hook.
- **Node version**: `engines` specifies 16.x/17.x/18.x, but CONTRIBUTING.md says 18.x. Use 18.x.

## Data flow: server → sdk-ts → webapp

The full request/response cycle with case conversion at each layer:

```
Webapp (camelCase)  →  SDK request middleware  →  API wire (snake_case)  →  Server SerializeInterceptor.in  →  DTOs (camelCase)
Webapp (camelCase)  ←  SDK response middleware  ←  API wire (snake_case)  ←  Server SerializeInterceptor.out  ←  Service (camelCase)
```

1. **Server DB columns**: snake_case (MariaDB/Objection.js).
2. **Server DTOs** (`@ApiProperty`): camelCase — used for internal class-validator validation only.
3. **`SerializeInterceptor`** (global, `packages/server/src/common/interceptors/serialize.interceptor.ts`):
   - **Inbound**: converts request body/query from **snake_case → camelCase** so DTOs receive camelCase keys.
   - **Outbound**: converts response from **camelCase → snake_case** before sending to client.
   - **Net effect**: the API wire format is always **snake_case**.
4. **SDK request middleware** (`shared/sdk-ts/src/middleware/snake-case-request-middleware.ts`): enabled by default. Converts outgoing request body/query from camelCase → snake_case (to match what the server interceptor expects).
5. **SDK response middleware** (`shared/sdk-ts/src/middleware/camel-case-middleware.ts`): **disabled by default** (`disableCamelCaseTransform: true`). Converts snake_case → camelCase when opted in.
6. **Webapp consumption**:
   - **SDK fetcher path** (`useApiFetcher()` in `packages/webapp/src/hooks/useRequest.tsx`): most queries get **snake_case** data by default. Pass `{ enableCamelCaseTransform: true }` to get automatic camelCase.
   - **Legacy axios path** (`useApiRequest()`): no automatic transform. Use `transformToCamelCase()` / `transfromToSnakeCase()` from `@/utils` manually.

### Practical impact

- **When writing new query hooks**: use `useApiFetcher({ enableCamelCaseTransform: true })` and work with camelCase. Types from `@bigcapital/sdk-ts` are camelCase.
- **When using legacy `apiRequest`**: responses are snake_case — call `transformToCamelCase(res.data)` before using.
- **Database columns** are always snake_case. When adding migrations, use snake_case. When writing Objection.js models, map to camelCase properties.
- **New API endpoints**: define DTOs with camelCase `@ApiProperty` names. The `SerializeInterceptor` handles the rest.

## Architecture notes

- **Multi-tenancy**: Each tenant gets its own database. `TenantDBManager` handles per-tenant DB connections. System DB stores tenant registry.
- **Server modules**: Feature modules live in `packages/server/src/modules/<Feature>/`. Each module typically has its own NestJS module, service, controller, and model.
- **ORM**: Objection.js (built on Knex). Models in `packages/server/src/models/`.
- **Auth**: Passport.js with JWT strategy. Multi-tenant auth via `nestjs-cls` (continuation-local storage).
- **Background jobs**: Bull/BullMQ with Redis.
- **Object storage**: S3-compatible (Garage in dev) for attachments/documents. Configured via `S3_*` env vars with `S3_FORCE_PATH_STYLE=true` for Garage.
- **PDF generation**: Gotenberg service (`:9000` in dev) using the server's `GET /public/` static files + pdf-templates.
- **SDK generation**: `pnpm run generate:sdk-types` exports OpenAPI spec from server, generates TypeScript types via `openapi-typescript`, builds the SDK package. Run this after API schema changes.
- **License**: AGPL for the open-source edition. Some modules under `modules/EE/` may be enterprise-only.

## PR workflow

Use `gh` CLI (GitHub CLI). Install: `brew install gh` (macOS), then `gh auth login`.

```bash
# Create a draft PR (uses conventional commit format, targets develop)
gh pr create --draft --title "type(scope): title" --body-file .github/pull_request_template.md --base develop

# List your PRs
gh pr list --author "@me"

# Convert draft to ready for review
gh pr ready <PR-NUMBER>

# Add reviewers
gh pr edit <PR-NUMBER> --add-reviewer user1,user2
```

- **PR template**: `.github/pull_request_template.md` — always use it via `--body-file`.
- **Title format**: conventional commits (`feat(scope):`, `fix(scope):`, `chore:`, etc.).
- **Target branch**: `develop` (not `main`).
- **All PR content must be in English**.
