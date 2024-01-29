# Change Log

All notable changes to Bigcapital server-side will be in this file.

## [0.14.0] - 30-01-2024

* feat: purchases by items exporting by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/327
* fix: expense amounts should not be rounded by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/339
* feat: get latest exchange rate from third party services by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/340
* fix(webapp): inconsistency in currency of universal search items by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/335
* hotfix: editing sales and expense transactions don't reflect GL entries by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/342

## [0.13.3] - 22-01-2024

* hotfix(server): Unhandled thrown errors of services by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/329

## [0.13.2] - 21-01-2024

* feat: show customer / vendor balance. by @asenawritescode in https://github.com/bigcapitalhq/bigcapital/pull/311
* feat: inventory valuation csv and xlsx export by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/308
* feat: sales by items export csv & xlsx by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/310
* fix(server): the invoice and payment receipt printing by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/315
* fix: get cashflow transaction broken cause transaction type by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/318
* fix: `AccountActivateAlert` import by @xprnio in https://github.com/bigcapitalhq/bigcapital/pull/322

## [0.13.1] - 15-01-2024

* feat(webapp): add approve/reject to action bar of estimate details dr… by @ANasouf in https://github.com/bigcapitalhq/bigcapital/pull/304
* docs: add ANasouf as a contributor for code by @allcontributors in https://github.com/bigcapitalhq/bigcapital/pull/305
* feat: Export general ledger & Journal to CSV and XLSX by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/303
* feat: Auto re-calculate the items rate once changing the invoice exchange rate. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/270

## [0.13.0] - 31-12-2023

* feat: Send an invoice mail the customer email by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/292
* fix: Allow non-numeric postal codes by @cschuijt in https://github.com/bigcapitalhq/bigcapital/pull/294
* docs: add cschuijt as a contributor for bug by @allcontributors in https://github.com/bigcapitalhq/bigcapital/pull/295

## [0.12.1] - 17-11-2023

* feat: Add default customer message and terms conditions to the transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/291
* fix: The currency code of transaction tax rate entry by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/293

## [0.12.0] - 04-11-2023

* feat: Export reports via CSV and XLSX by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/286
* fix: Axios upgrade by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/288
* fix(server): Allow decimal amount in sale/purchase transactions. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/289
* feat: Optimize invoice documents printing by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/280
* chore(deps): bump axios from 0.20.0 to 1.6.0 in /packages/server by @dependabot in https://github.com/bigcapitalhq/bigcapital/pull/284
* chore(deps): bump axios from 0.20.0 to 1.6.0 by @dependabot in https://github.com/bigcapitalhq/bigcapital/pull/283

## [0.11.0] - 28-10-2023

* feat: Migrate to pnpm by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/253
* feat: Integrate tax rates to bills by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/260
* feat: Assign default sell/purchase tax rates to items by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/261
* chore(deps-dev): bump @babel/traverse from 7.23.0 to 7.23.2 in /packages/server by @dependabot in https://github.com/bigcapitalhq/bigcapital/pull/272
* feat: Improve financial statements rows color by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/276
* fix: Trial balance sheet adjusted balance by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/273
* feat: Adds tax numbers to organization and customers by @kochie in https://github.com/bigcapitalhq/bigcapital/pull/269
* docs: Add kochie as a contributor for code by @allcontributors in https://github.com/bigcapitalhq/bigcapital/pull/277
* feat: Computed Net Income under Equity in Balance Sheet report. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/271
* fix: Change Dockerfile files with new pnpm by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/278

## [0.10.2] - 02-10-2023

fix(webapp): Disable tax rates from item entries editor table services do not support tax rates (https://github.com/bigcapitalhq/bigcapital/commit/69afa07e3ba45495a4cab3490c15f2b0c40c4790) by @abouolia 
fix(server): Add missing method in ItemEntry model (https://github.com/bigcapitalhq/bigcapital/commit/07628ddc37f46c98959ced0323f28752e0a98944) by @abouolia

## [0.10.1] - 25-09-2023

* Fix: Running tenants migration on Docker migration container by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/242

## [0.10.0] - 24-09-2023

* Added: Tax rates service by @abouolia @elforjani13  in https://github.com/bigcapitalhq/bigcapital/pull/204
* Added: Sales Tax Liability Summary report by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/204
* Added: Tax rates tracking with sale invoices by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/204
* fix(webapp): Table headers sticky for all reports. by @elforjani13 in https://github.com/bigcapitalhq/bigcapital/pull/240
* chore(deps): bump word-wrap from 1.2.3 to 1.2.4 by @dependabot in https://github.com/bigcapitalhq/bigcapital/pull/200
* chore(deps): bump word-wrap from 1.2.3 to 1.2.4 in /packages/webapp by @dependabot in https://github.com/bigcapitalhq/bigcapital/pull/199
* chore(deps): bump mongoose from 5.13.15 to 5.13.20 by @dependabot in https://github.com/bigcapitalhq/bigcapital/pull/197

## [0.9.12] - 29-08-2023

* Refactor: split the services to multiple service classes. (by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/202)
* Fix: create quick customer/vendor by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/206
* Fix: typo in bill success message without bill number by @KalliopiPliogka in https://github.com/bigcapitalhq/bigcapital/pull/219
* Fix: AP/AR aging summary issue by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/229
* Fix: shouldn't write GL entries when save transaction as draft. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/221
* Fix: Transaction type of credit note and vendor credit are not defined on account transactions by @abouolia in 
* Fix: date format of filtering transactions by date range by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/231
* Fix: change the default from/date date value of reports by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/230
* Fix: typos in words start with `A` letter by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/227
* Fix: filter by customers, vendors and items in reports do not work by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/224
https://github.com/bigcapitalhq/bigcapital/pull/225

## [0.9.11] - 23-07-2023

* added: Restart policy to docker compose files. by @suhaibaffan in https://github.com/bigcapitalhq/bigcapital/pull/198
* fix: Expose and expand the rate limit to the env variables by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/195

## [0.9.10] - 18-07-2023

* feat(e2e): E2E onboarding process by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/176
* fix(webapp): Show loading message of cost computing job on financial reports by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/196
* fix(webapp): Change the currency code of sales and purchases transactions with foreign contacts. 

## [0.9.9] - 28-06-2023

* refactor: Customer and vendor select component by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/171
* chore: Move auto-increment components in separate files by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/170
* fix: Style of quick item drawer by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/173
* fix: Should not show the form before loading account by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/172
* fix: Payment made form does not handle not unique number an e… by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/177
* fix: Internal note of invoice/bill payment does not saving by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/181
* fix: Storing cash flow transaction description by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/180
* fix: No currency in amount field on money in/out dialogs by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/179
* fix: No default branch for customer/vendor opening balance branch by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/182

## [0.9.8] - 19-06-2023

`bigcapitalhq/webapp`

* add: Inventory Adjustment option to the item drawer by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/158
* fix: use all drawers names from common enum object by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/157
* fix: adjustment type options do not show up by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/159
* fix: change the remove line text to be red to intent as a danger action by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/162
* fix: rename sidebar localization keys names to be keyword path by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/161
* fix: manual journal placeholder text by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/160
* fix: warehouses select component by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/168

`bigcapitalhq/server`

* fix: sending emails on reset password and registration by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/167

## [0.9.7] - 14-06-2023

`@bigcapital/webapp`
* fix: change the footer links of onboarding pages by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/139

`@bigcapital/server`
* fix: expense transaction journal entries by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/155

## [0.9.6] - 12-06-2023

`@bigcapital/webapp`

* fix: remove duplicated form submitting by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/138
* feat: add monorepo version on the application sidebar by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/136

## [0.9.5] - 11-06-2023

`@bigcapital/server`

* fix: filter ledger entries that effect contact balance to AR/AP accounts only by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/132

`@bigcapital/webapp`

* fix: catch journal error when create a journal with accounts have different currency by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/135
* fix: add duplicate icon to context menu of customers and vendors table by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/133
* fix: customer/vendor opening balance with exchange rate by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/134

## [0.9.4] - 08-06-2023

`@bigcapital/monorepo`
- fixed: docker-compose line-ending issue on Windows by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/130

`@bigcapital/server`
- fixed: Disable Webpack minification for JS class name reading.

## [0.9.3] -04-06-2023

`@bigcapital/monorepo`
* Added: Add env variable to customize the proxy public ports by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/125
* Added: Migrate the server database to MariaDB by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/128

## [0.9.2] - 31-05-2023

`@bigcapital/webapp`

- fixed: move `packaeg-lock.json` inside docker container.
- fixed: remove Sentry from the web client.

## [0.9.1] - 28-05-2023

`@bigcapital/server`
- fix: deleting ledger entries of manual journal.
- fix: base currency should be enabled.
- fix: delete invoice transaction issue.

`@bigcapital/webapp`
- fix: general, accountant and items preferences.
- fix: auto-increment sale invoices, estiamtes, credit notes, payments and manual journals.
- refactor: the setup organization form to use binded Formik components.

## [0.9.0] - 06-05-2023

`@bigcapital/server`

- [Sign-up restrictions](https://docs.bigcapital.ly/docs/deployment/signup_restriction) for self-hosting instances to disable signup or control the allowed email addresses and domains that can sign-up.

## [0.8.3] - 06-04-2023

`@bigcaptial/monorepo`

- Switch to AGPL license to protect application's networks. by @abouolia

`@bigcapital/webapp`

### Added

- Improve the style of authentication pages. by @abouolia
- Remove the phone number field from the authentication pages. by @abouolia
- Remove the phone number field from the users management. by @abouolia
- Add all countries options to the setup page. by @abouolia

### Fixed

- Fix intent type of reset password success toast.

`@bigcapital/server`

### Added

- Remove the phone number field from the authentication service. by @abouolia
- Remove the phone number field from the users service. by @abouolia

## [0.8.1] - 26-03-2023

`@bigcaptial/monorepo`

### Added 
* add docker compose for development env. by @abouolia

`@bigcapital/webapp`

### Fixes
* fix: hide the project name entry if the feature was not enabled. by @abouolia
* fix: labels of add money in/out don't appear. by @abouolia
* fix: accounts chart lags when scrolling down. by @abouolia
* fix: the inconsistent style of quick customer/vendor drawer. by @abouolia
* fix: add an icon to duplicate item of items context menu. by @abouolia
* fix: account form issues. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/86

### Added
* Optimize the design of setup organization page. by @abouolia 

`@bigcapital/server`

### Added
* bigcapital CLI commands by @abouolia
* deprecate the subscription module. @abouolia

### Fixes
* fix: Validate the max depth level of the parent account. by @abouolia

## [0.7.6] - 23-04-2022

`@bigcapital/webapp`

### Fixed

- `BIG-374` Refactoring sidebar men with ability permissions and feature control on each item.

## [0.7.5] - 20-04-2022

### Fixed.

- `BIG-378` Reports drawers columns css conflict.

## [0.7.3] - 15-04-2022

`@bigcapital/webapp`

### Fixed

- `BIG-372` Activate branches and warehouses dialog reloading once activating.
- `BIG-373` Issue general ledger report select specific account.
- `BIG-377` Make readonly details entries as oneline with tooltip for more details.

## [0.7.2] - 04-04-2022

`@bigcapital/webapp`

### Fixed

- Add the missing Arabic localization.
- Subscription plans modifications.

## [0.7.1] - 30-03-2022

`@bigcapital/webapp`

### Added
  - `BIG-141` Add inactive status to item drawer details.
  - `BIG-278` Add created at date on expense details.
  - `BIG-350` Add empty status content of warehouse transfers service.
  - `BIG-344` Add branch details to manual journal and expense details.
### Fixed
  - `BIG-221` Remove Non-inventory radio choice on item form.
  - `BIG-236` Validate estimate expiration date should be equal or bigger than estimate date.
  - `BIG-237` Validate invoice due date should be equal or bigger than invoice date.
  - `BIG-238` Validate bill due date should be equal or bigger than bill date.
  - `BIG-280` Optimize style of multi-select accounts menu.
  - `BIG-284` Cashflow statement loading bar.
  - `BIG-296` Creating a new child account from accounts list.
  - `BIG-301` Navigation bar divider on actions bar hide with permissions control.
  - `BIG-304` Adding cash or bank account from cash flow service.
  - `BIG-351` Invalid date in the inventory adjustment detail.
  - `BIG-352` Fix terms and notes fields on footer of all services.
  - `BIG-354` Validate the warehouse transfer quantity should be above zero.

`@bigcapital/server`

### Fixed
  - `BIG-354` Validate the warehouse transfer quantity should be above zero.
  - `BIG-358` Refactoring customers/vendors services for smaller classes.
  - `BIG-341` Refactoring expenses services for smaller classes.
  - `BIG-342` Assign default currency as base currency when create customer, vendor or expense transaction.

## [0.7.0] - 24-03-2022

`@bigcapital/webapp`

### Added 
 - Multiply currencies with foreign currencies.
 - Multiply warehouses to track inventory items.
 - Multiply branches to track organization transactions.
 - Transfer orders between warehouses.
 - Integrate financial reports with multiply branches.
 - Integrate inventory reports with multiply warehouses.

### Changes
 - Optimize style of sale invoice form.
 - Optimize style of sale receipt form.
 - Optimize style of credit note form.
 - Optimize style of payment receive form.
 - Optimize style of bill form.
 - Optimize style of payment made form.
 - Optimize style of manual journal form.
 - Optimize style of expense form.

`@bigcapital/server`

### Added
 - Multiply currencies with foreign currencies.
 - Multiply warehouses to track inventory items.
 - Multiply branches to track organization transactions.
 - Transfer orders between warehouses.
 - Integrate financial reports with multiply branches.
 - Integrate inventory reports with multiply warehouses.

## [0.6.3] - 21-02-2022

`@bigcapital/webapp`

### Fixed

- `BIG-337` Display billing page once the organization subscription is inactive.

## [0.6.2] - 19-02-2022

### Fixed

- fix syled components dependency with imported as default components.

## [0.6.0] - 18-02-2022

`@bigcapital/webapp`

### Added

- Balance sheet comparison of previous period (PP).
- Balance sheet comparison of previous year (PY).
- Balance sheet percentage analysis columns and rows basis.
- Profit & loss sheet comparison of preivous period (PP).
- Profit & loss sheet comparison of previous year (PY).
- Profit & loss sheet percentage analysis columns, rows, income and expenses basis.

## [0.5.8] - 13-01-2022

`@bigcapital/webapp`

### Added

- Add payment receive PDF print.
- Add credit note PDF print.

### Fixed
- Payment receive initial loading state depends on request loading state instead fetching.
- Balance sheet report alert positioning.
- Separate customer and vendor inactivate and activate alerts.
- Hide convert to invoice button if the invoice is already converted.
- Customer and vendor balance summary percentage of column option.
- Remove duplicated details in sales and purchases details drawers.

`@bigcapital/server`

### Fixed
- Balance sheet comparison of previous period (PP).
- Balance sheet comparison of previous year (PY).
- Balance sheet percentage analysis columns and rows basis.
- Profit & loss sheet comparison of preivous period (PP).
- Profit & loss sheet comparison of previous year (PY).
- Profit & loss sheet percentage analysis columns, rows, income and expenses basis.

## [0.5.3] - 03-01-2020

`@bigcapital/webapp`

### Fixed

- Localize the global errors.
- Expand account name column on trial balance sheet.

## [0.5.0] - 20-12-2021

`@bigcapital/webapp`

### Added

- Add credit note on sales module.
- Add vendor credit on purchases module.
- Optimize landed costs on purchase invoices.
- Display associated payment transactions on sale invoice drawer.
- Display associated pamyment transactions on purchase invoice drawer.
- Display item associate invoice, bill, estimate and receipt transactions.
- Transactions locking on all transactions or individual modules.
- Roles and permissions access control module.
- Optimize readonly details style of invoice, receipt, estimate, payment receive,
  purchase invoice, expense, manual journal, inventory adjustment and cashflow transaction.

### Changed

- Dashboard meta boot and authenticated user request query.
- Optimize Arabic localization.

## [0.4.0] - 11-09-2021

`@bigcapital/webapp`

### Added

- Add SMS notification on sale invoice, receipt, customers payments modules.
- Customer quick create in customers list.
- Item quick create in items list.

### Changes

change: BIG-171 alerts in global scope and lazy loading.

### Fixed

fix: BIG-140 - Reordering sell, cost and inventory account on item details.
fix: BIG-144 - Typo adjustment dialog success message.
fix: BIG-148 - Items entries ordered by index.
fix: BIG-132 AR/AP aging summary report filter by none transactions/zero contacts.

## [0.2.0] - 03-09-2021

`@bigcapital/webapp`

Here we write upgrading notes for brands. It's a team effort to make them as
straightforward as possible.

### Added

- Add slidable sub-sidebar to improve user experience instead of sub-menu.
- Add Subscription guard to ensure the organization's subscription is active or
  redirect all routes to subscription billing page.
- Add universal search.
- Add drawer details of sale invoice.
- Add drawer details of sale receipt.
- Add drawer details of sale estimate.
- Add drawer details of purchase invoice.
- Add drawer details of payment receive/made.
- Add drawer details of item.
- Add drawer details of inventory adjustment.
- Add drawer details of account.
- Add drawer details of manual journal.
- Add drawer details of expense.
- Add drawer details of expense.
- Add landed cost on purchase invoice.
- Add sale invoice print with preview dialog.
- Add sale estimate print with preview dialog.
- Add sale receipt print with preview dialog.
- Advanced filter for database items.
- Inventory adjustment publish action.
- Customers and vendors activate and inactivate action.
- Add refresh button on dashboard actions bar to all datatables resources.
- Add clickable datatable rows to display each row details.

### Changed

- Optimize style of datatable selection checkbox.
- Disable animation in dashboard views tabs.
- Optimize Arabic localization.

### Fixed

- fix: disable submit buttons in pereferences pages.
- fix: inventory adjustment cost field max/min range to avoid out of range error.
- fix: transactions by customers/vendors report localization.
- fix: Datatable head progressbar with right-to-left direction.
- fix: Submit buttons loading state once payment made/receive form is submitting.
- fix: Ensure items entries should have one empty line atleast.
- fix: items entries total calculation.
- fix: Momerized fields re-rendering conditions.
- fix: auto-complete item entry with cost price on purchase invoice form.
