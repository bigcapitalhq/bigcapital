# Change Log

All notable changes to Bigcapital server-side will be in this file.

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
