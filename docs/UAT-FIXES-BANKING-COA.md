# UAT Fixes — Banking + Chart of Accounts

Record of the fixes applied in response to three UAT reports:

1. Inability to edit a transaction after categorization.
2. Inability to browse other categories within bank accounts.
3. Inability to edit Account Normal (credit/debit) behaviour within COA.

Status: **implemented — awaiting QA pass**.

---

## 1. Edit a categorized bank transaction

### What the user reported
> Once you categorize a transaction, you cannot change ANYTHING regarding the transaction — coding, memo, reference, anything.

### Root cause
Two layered gaps:
- **No edit endpoint** existed for categorized bank transactions. The controller had `POST`, `GET`, `DELETE` but no `PATCH`/`PUT`.
- **"Uncategorize" already exists server-side** (`DELETE /banking/categorize/:id` + `/banking/categorize/bulk`) but may not be surfaced in the UI.

### What changed

**Server — new PATCH endpoint for descriptive metadata**

- `packages/server/src/modules/BankingTransactions/dtos/EditBankTransaction.dto.ts` (new) — optional `description`, `referenceNo`, `transactionNumber` with length caps.
- `packages/server/src/modules/BankingTransactions/commands/EditBankTransaction.service.ts` (new) — `editTransaction(id, dto)` with PATCH semantics (only supplied fields update), wrapped in `UnitOfWork` transaction, returns 404 for missing rows.
- `packages/server/src/modules/BankingTransactions/controllers/BankingTransactions.controller.ts` — added `@Patch(':id')` route.
- `BankingTransactionsApplication` + `BankingTransactions.module` — service wired into DI.

### Scope boundary (intentional)
- **IN-scope for this PATCH**: `description`, `referenceNo`, `transactionNumber`.
- **OUT of scope**: amount, accounts, date, exchange rate, transaction type. These affect the GL posting and must go through **uncategorize → recategorize** so the journal entry is reversed and a new one is posted. Patching them in place would silently corrupt historical ledgers. This is an accounting-correctness rule, not an engineering preference.

### Follow-up for the webapp team (not done in this PR)
- Surface the existing `DELETE /banking/categorize/:id` action on categorized transactions so users can uncategorize.
- Wire the new `PATCH /banking/transactions/:id` endpoint into the transaction-detail form.
- If desired, package uncategorize + recategorize as a single "recategorize" UX action at the frontend — server calls both endpoints in order.

### API example
```
PATCH /api/banking/transactions/42
Content-Type: application/json

{ "description": "Updated memo", "referenceNo": "INV-2026-003" }
```
Returns the updated `BankTransaction` row.

---

## 2. Browse "other categories" within bank accounts

### What the user reported
> Inability to browse other categories within bank accounts (e.g. "other income" but should be able to browse accounts under "income").

### Root cause
**Label mismatch**, not a filter bug. The "Money In" dropdown option was labeled **"Other income"** but its downstream `AccountsSelect` filter is `filterByRootTypes=['income']` — which matches **both** the `Income` and `OtherIncome` account types (they share `rootType: 'income'` per `server/src/constants/accounts.ts`). Users saw the narrow label and assumed the dropdown was restricted to Other-Income-only accounts.

### What changed

- `packages/webapp/src/lang/en/index.json` — `banking.other_income` label changed from `"Other income"` → `"Income"`.
- `packages/webapp/src/containers/CashFlow/CategorizeTransaction/drawers/CategorizeTransactionDrawer/MoneyIn/CategorizeTransactionOtherIncome.tsx` — added an inline comment documenting that the rootType filter captures all income-class accounts regardless of subtype, so a future engineer doesn't narrow the filter based on the historic label.

### Not done (flag for translation team)
The label change is English-only. Other locales (`sv`, `ar`, others) still show the old narrow wording. If the product team agrees with the rename, the strings in those files should follow.

### No server changes
The server-side account taxonomy and filter behavior was already correct — both `Income` and `OtherIncome` accounts appear under `rootType: 'income'` and are admitted by the categorize dropdown's filter. This was always a UI/wording problem.

---

## 3. Edit Account Normal (debit/credit) behaviour within COA

### What the user reported
> Inability to edit Account Normal (credt/debit) behaviour within COA.

### Interpretation (the accounting-correct one)
"Account Normal" is not a user-facing editable property in any double-entry accounting system. It is **derived from the account type**: Assets and Expenses are debit-normal; Liabilities, Equity, Income are credit-normal. The normal is an invariant of the type, not an override. Adding a user-editable "normal override" would let a user flip the sign of every historical transaction referencing the account — that corrupts every report the account appears in.

The real request underneath this UAT ticket is "**let me change the account's type**," because changing the type is the only legitimate way to change the normal. Previously, the system rejected *all* account-type changes unconditionally. That's overly strict — a type change on a newly-created, never-posted-to account is a harmless reclassification.

### What changed

- `packages/server/src/modules/Accounts/CommandAccountValidators.service.ts` — rewrote `isAccountTypeChangedOrThrowError()`:
  - Type unchanged → no-op.
  - Type changed **AND** the account has **zero** rows in `accounts_transactions` → **allow**.
  - Type changed **AND** transactions exist → still throw `ACCOUNT_TYPE_NOT_ALLOWED_TO_CHANGE`.
- Injected `AccountTransaction` model via `TenantModelProxy`, used `.resultSize()` for the count.
- Extensive doctor's-note docstring explaining **why** the three-branch policy is the right answer and why direct normal-override is (intentionally) not added.

### What the UI gets
- On a freshly-created / never-posted-to account: the user can change the type in the COA edit form. The normal (derived) changes to match.
- On an account with any `accounts_transactions` row: the type field stays effectively read-only; the server will still throw `ACCOUNT_TYPE_NOT_ALLOWED_TO_CHANGE`. The webapp should surface this as a clear error rather than a generic failure — the error code is stable (`ACCOUNT_TYPE_NOT_ALLOWED_TO_CHANGE`) and can be mapped to a specific user-facing message.

### What the UI does NOT get (intentional)
- A direct "Account Normal" toggle on the COA form. If this comes back from UAT, the accounting-correct response is: "You can't. Change the type instead; the normal follows from the type."

### Recommended test coverage before ship
Three server tests against `CommandAccountValidators.isAccountTypeChangedOrThrowError`:
1. Type unchanged — no throw.
2. Type changed, zero `accounts_transactions` rows — no throw.
3. Type changed, one or more `accounts_transactions` rows — throws `ACCOUNT_TYPE_NOT_ALLOWED_TO_CHANGE`.

Plus an integration test on the `PATCH /accounts/:id` route covering case (3) with a real posted transaction.

---

## Residual work tracked for the product team

- **Item 1**: webapp uncategorize button surfacing + edit form wiring (server is done).
- **Item 1**: if product wants a single-click "recategorize" action, that's a webapp orchestration of existing server endpoints.
- **Item 2**: translate the renamed label to other locales.
- **Item 3**: webapp should map `ACCOUNT_TYPE_NOT_ALLOWED_TO_CHANGE` (when transactions exist) to a specific user-facing message. Suggested copy: *"This account has posted transactions and its type cannot be changed. Create a new account with the correct type instead."*
- **Item 3**: server tests for the three branches of the new validator before merging to main.

See `.claude/CLAUDE.md` → "Accounting-Domain Invariants" for the reusable patterns that came out of this work.
