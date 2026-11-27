# AI assistant

The homepage AI assistant lets users ask questions about their accounting and
business data in natural language. It uses the Vercel AI SDK (`ai` v6), the
OpenAI provider, and read-only tools that query the tenant database.

## How it works

```
Homepage chat (useChat + DefaultChatTransport)
  -> POST /api/ai/chat
  -> NestJS validates messages and conversation ownership
  -> streamText + read-only tools
  -> SSE UI message stream
  -> onFinish persists the assistant message
```

The model never generates SQL and never mutates data. Every tool returns
aggregated results in the organization base currency or the relevant contact
currency.

## Setup

1. Add the environment variables to the root `.env`:

   ```bash
   AI_ASSISTANT_ENABLED=true
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-6-luna
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build and run tenant migrations:

   ```bash
   pnpm run build:server
   pnpm run tenants:migrate:latest
   ```

   The migration creates `ai_conversations` and `ai_messages` in each tenant
   database.

4. Start the server and webapp:

   ```bash
   pnpm run dev:server
   pnpm run dev:webapp
   ```

The assistant is hidden on the homepage unless `GET /api/ai/status` returns
`{ enabled: true, authorized: true }`.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `AI_ASSISTANT_ENABLED` | `true` | Set to `false` to force-disable the assistant. |
| `OPENAI_API_KEY` | — | Required. Without it the assistant is disabled. |
| `OPENAI_BASE_URL` | — | Optional OpenAI-compatible base URL (gateway/proxy). |
| `OPENAI_MODEL` | `gpt-6-luna` | OpenAI model id. |
| `AI_MAX_STEPS` | `6` | Maximum model/tool steps per request. |
| `AI_MAX_OUTPUT_TOKENS` | `1500` | Maximum output tokens per response. |
| `AI_REQUEST_TIMEOUT_MS` | `60000` | Total request timeout. |
| `AI_REASONING_EFFORT` | `low` | OpenAI reasoning effort (`none`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`). |

`gpt-6-luna` is the default: the most cost-efficient GPT-6 model for
high-volume assistant workloads. Set `OPENAI_MODEL=gpt-6.1-terra` or
`gpt-6.1-sol` when you need stronger reasoning for complex analysis. For the
lowest cost, set `AI_REASONING_EFFORT=none`; tool calling still works.

## Access control

The assistant requires at least one financial report read ability
(`ReportsAction` on `AbilitySubject.Report`). Admins with `manage all` always
have access.

Tools are additionally filtered by ability:

| Tool | Requires |
|---|---|
| `get_financial_summary` | `Report.ReadProfitLoss` |
| `get_profit_and_loss_breakdown` | `Report.ReadProfitLoss` |
| `get_top_customers_by_profit` | `Report.ReadProfitLoss` |
| `get_customer_profitability` | `Report.ReadProfitLoss` |
| `get_item_performance` | `Report.ReadSalesByItems` or `Report.ReadProfitLoss` |
| `get_outstanding_receivables` | `Report.ReadARAgingSummary` or `Customer.View` |
| `get_cash_position` | `Account.View` |
| `get_inventory_levels` | `Item.View` |
| `search_business_records` | `Customer.View`, `Vendor.View`, or `Item.View` |

Conversations are private to the user who created them. There is no admin view
of another user's conversations.

## Tool catalog

- `search_business_records` — resolves a customer, vendor, or item name to IDs.
- `get_financial_summary` — revenue, COGS, gross profit, operating expenses,
  net profit, invoice count, and average invoice value.
- `get_profit_and_loss_breakdown` — largest income, COGS, and expense accounts
  with totals and percentages.
- `get_top_customers_by_profit` — customer revenue, COGS, gross profit, margin,
  and invoice count, ranked by gross profit.
- `get_customer_profitability` — one customer's profitability plus outstanding
  balance and last invoice date.
- `get_item_performance` — units sold, revenue, COGS, gross profit, margin, and
  average selling price. Omit the item to get the top items by revenue.
- `get_outstanding_receivables` — customer receivable balances.
- `get_cash_position` — cash and bank account balances.
- `get_inventory_levels` — stock on hand, reorder point, and estimated value.

### Data definitions

- **Revenue** = income and other-income account credits minus debits on posted
  sale invoices. Invoice discounts and adjustments are included through
  other-income entries.
- **COGS** = costable ledger debits minus credits on posted sale invoices.
- **Gross profit** = revenue − COGS.
- **Net profit** = gross profit − operating expenses.
- The organization accounting basis setting (`accrual` or `cash`) is respected.
- Ledger amounts are in the organization base currency. Receivable balances are
  in the customer currency and include a `currencyCode` field.
- Item margins are before invoice-level discounts, which are not allocated to
  individual items.
- Credit notes and refunds are not yet included in customer profitability.

## Security and privacy

- The OpenAI API key is server-only and never sent to the browser.
- `store: false` is set on each OpenAI request so responses are not stored by
  OpenAI by default.
- Queries are read-only, parameterized, tenant-scoped, and capped by row limits
  and a 5-second query timeout.
- Only aggregated data is sent to the model; emails, phone numbers, addresses,
  and notes are never returned by tools.
- Client-supplied system messages are rejected.
- Historical tool results are stripped from subsequent requests.
- The chat endpoint is rate-limited to 20 requests per minute per IP.
- Question text and aggregated business data are sent to OpenAI. Review your
  data processing policy before enabling the assistant in production.

## API endpoints

The AI endpoints are intentionally excluded from the public OpenAPI spec and
use camelCase JSON (the AI SDK message-part format). Do not use the generated
SDK functions for them.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/ai/status` | `{ enabled, authorized }` |
| `POST` | `/api/ai/chat` | SSE UI-message stream |
| `GET` | `/api/ai/conversations` | List the current user's conversations |
| `POST` | `/api/ai/conversations` | Create an empty conversation |
| `GET` | `/api/ai/conversations/:id` | Conversation with messages |
| `DELETE` | `/api/ai/conversations/:id` | Delete a conversation |

The chat request body is:

```json
{
  "conversationId": 12,
  "trigger": "submit-message",
  "messageId": "optional-message-id",
  "messages": [
    {
      "id": "m1",
      "role": "user",
      "parts": [{ "type": "text", "text": "Who are my top customers by profit?" }]
    }
  ]
}
```

## Persistence

`ai_conversations` stores the owner (`system_user_id`), title, and timestamps.
`ai_messages` stores the AI SDK message parts as JSON, extracted text content,
and metadata (model, usage, finish reason, status). Deleting a conversation
cascades to its messages.

The title is derived from the first user message. Regenerating a response
replaces the last assistant message instead of duplicating it.

## Limitations and follow-ups

- The assistant is read-only. It cannot create, edit, delete, pay, or send.
- Arbitrary SQL is not exposed. Questions outside the tool catalog get a clear
  "I cannot answer that from available data" response.
- Conversations are not filtered by branch or tracking category yet.
- There is no admin view or retention policy for conversations yet.
- Upgrading to AI SDK 7 is a separate task.

## Troubleshooting

- **The card does not appear**: check `GET /api/ai/status`. It requires
  authentication, an `organization-id` header, and at least one report read
  permission.
- **`enabled: false`**: set `OPENAI_API_KEY` and `AI_ASSISTANT_ENABLED=true`,
  then restart the server.
- **`401` / "not configured correctly"**: the OpenAI key is invalid or lacks
  access to the configured model.
- **`429`**: the user or IP hit the chat rate limit or the OpenAI rate limit.
- **Migration directory corrupt**: another branch may have a migration recorded
  in your tenant database that is not present in the current checkout. Restore
  that migration file before running tenant migrations.

## Adding a tool

1. Add a query method to `AiAnalytics.repository.ts` using parameterized SQL.
2. Add a `tool({ description, inputSchema, execute })` entry in
   `ai-tools.factory.ts` and guard it with the appropriate ability.
3. Return small, aggregated, JSON-serializable results.
4. Add a unit test for the tool authorization/filtering and validate the SQL
   against a tenant database.
