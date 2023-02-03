
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.7.1-rc.2] - 30-03-2022

### Fixed
  - `BIG-354` Validate the warehouse transfer quantity should be above zero.
  - `BIG-358` Refactoring customers/vendors services for smaller classes.
  - `BIG-341` Refactoring expenses services for smaller classes.
  - `BIG-342` Assign default currency as base currency when create customer, vendor or expense transaction.
## [1.7.0-rc.1] - 24-03-2022

## Added
 - Multiply currencies with foreign currencies.
 - Multiply warehouses to track inventory items.
 - Multiply branches to track organization transactions.
 - Transfer orders between warehouses.
 - Integrate financial reports with multiply branches.
 - Integrate inventory reports with multiply warehouses.

## [1.6.1] - 19-02-2022
### Fixed
 - fix: `BIG-329` Total of aggregate/accounts nodes of Balance sheet.
 - fix: `BIG-329` Total of aggregate/accounts nodes of Profit & Loss sheet.
 - fix: `BIG-328` Localization of total column label of P&L sheet date periods mode.

## [1.6.0] - 18-02-2022

### Added
 - Balance sheet comparison of previous period (PP).
 - Balance sheet comparison of previous year (PY).
 - Balance sheet percentage analysis columns and rows basis.
 - Profit & loss sheet comparison of preivous period (PP).
 - Profit & loss sheet comparison of previous year (PY).
 - Profit & loss sheet percentage analysis columns, rows, income and expenses basis.


## [1.5.3] - 13-01-2022

### Changed

 - Optimize style of sale invoice PDF template.
 - Optimize style of sale estimate PDF template.
 - Optimize style of credit note PDF template.
 - Optimize style of payment receive PDF template.
 - Optimize style of sale receipt PDF template.

### Fixed
 - fix: Customer and vendor balance summary percentage of column.
 - fix: Filtering none transactions and zero accounts of cashflow sheet.
 
## [Unreleased] - yyyy-mm-dd
 
Here we write upgrading notes for brands. It's a team effort to make them as
straightforward as possible.
 
### Added
- Dynamic filter for resources list.
- Dynamic search for resources list.
- Dynamic resources to switch between active and inactive items.
- Add virtual computed attributes to sale invoice list and individual.
- This CHANGELOG file to hopefully serve as an evolving example of a
  standardized open source project CHANGELOG.
- Remove subscription free trial.

### Changed
 - Redesigne organization tenant metadata table to depend on table on system
   database instead of tenant database.
 - 
 
### Fixed
 
