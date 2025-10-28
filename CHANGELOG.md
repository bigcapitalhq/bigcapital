# Change Log

All notable changes to Bigcapital server-side will be in this file.

# [0.22.0]

* feat: estimate, receipt, credit note mail preview by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/757
* feat: Add discount to transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/758
* fix: update financial forms to use new formatted amount utilities and… by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/760
* fix: total lines style by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/761
* fix: discount & adjustment sale transactions bugs by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/762
* fix: discount transactions GL entries by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/763

# [0.21.2]

* hotbug: upload attachments by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/755

# [0.21.1]

* fix: download invoice document on payment page by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/750
* fix: attach branding template attrs to payment page by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/751
* fix: make manual entries adjust decimal credit/debit amounts by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/754
* feat: allow quantity of entries accept decimal value by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/753

# [0.21.0]

* fix: Credit and debit totals not balancing when decimal values are used by @nklmantey in https://github.com/bigcapitalhq/bigcapital/pull/722
* docs: add nklmantey as a contributor for bug by @allcontributors in https://github.com/bigcapitalhq/bigcapital/pull/725
* feat: track more services events by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/721
* feat: Invoice mail receipt preview by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/723
* fix: change the send mail button on invoice drawer by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/730
* refactor: notification mail services by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/731
* fix: attach payment link in sending invoice mail receipt by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/732
* fix: send invoice drawer layout by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/733
* fix: hook up cc and bcc fields to mail sender by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/734
* fix: company logo does not show up in mail receipt preview by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/736
* fix: change default invoice mail message by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/737
* fix: typing invoice send mail fields by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/738
* fix: clean up ivnoice mail receipt preview component by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/739
* feat: add shared package to pdf templates to render in the server and… by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/735
* feat: getting invoice preview on send mail view by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/740
* fix: style SSR invoice paper template by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/741
* fix: send invoice receipt addresses by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/742
* fix: due invoice server invoice by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/744
* fix: `BIG-265` forgot password text by @ibutiti in https://github.com/bigcapitalhq/bigcapital/pull/745
* Crims on sv translation by @Crims-on in https://github.com/bigcapitalhq/bigcapital/pull/671
* feat: Added Spanish language to the App 🇪🇸 by @angelosorno in https://github.com/bigcapitalhq/bigcapital/pull/530
* fix: mail services by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/746
* fix: company logo of the template by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/747
* fix: monorepo dependencies scope by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/748

# [0.20.6] 

* fix: Import category column of item resource by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/710
* fix: Parse the uppercase values in importing by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/711
* chore: Move i18nApply localization to the account transformer by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/713
* fix: Sync Plaid credit card account type by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/714
* fix: Sync account normal of cashflow GL entries by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/715
* feat: Add quantity column to pdf templates by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/716
* feat: Pre-line invoice statements by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/717
* feat: Invoice number in downloaded pdf document by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/718
* feat: Track events of pdf documents views by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/719
* fix: Customer note does not appear in pdf document by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/720

# [0.20.5]

* fix: Disable tabs of the pdf customization if the first field not filed up by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/701
* fix: Invoice form layout by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/705
* refactor: Invoice, estimate, receipt, credit note and payment received date input fields by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/707
* feat: Add customize templates button to edit forms by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/708
* feat: Track account, invoice and item viewed events by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/709

# [0.20.4]

* fix: Delete company logo from the PDF template by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/699
* fix: Set max width/height to company logo of pdf templates by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/700

# [0.20.3]

* feat: Assign default PDF template automatically by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/687
* fix: pdf template addresses controlling by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/688
* fix: Remove empty lines from address formats by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/690
* fix: Pdf templates layout by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/691
* feat: Download invoice pdf of the payment link by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/689
* fix: Display country name by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/693
* feat: Add shared packages to Docker container by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/694

# [0.20.2]

* feat: Assign default PDF template automatically by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/687
* fix: pdf template addresses controlling by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/688
* fix: Remove empty lines from address formats by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/690
* fix: Pdf templates layout by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/691
* feat: Download invoice pdf of the payment link by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/689
* fix: Display country name by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/693
* feat: Add shared packages to Docker container by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/694

# [0.20.1]

* fix: Getting uploaded object uri by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/684

# [0.20.0]

* feat: Customize pdf templates by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/667
* feat: Onboard accounts to Stripe Connect by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/668
* feat: Upload company logo to invoice templates by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/670
* fix: Invoice pdf customize by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/672
* fix: Invoice customize bugs by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/673
* feat: Clean up payment links endpoints by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/674
* feat: Hook up company logo to server-side pdf templates by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/675
* feat: Company branding preferences by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/677
* feat: Pdf templates customer/company addresses by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/678
* fix: Listen to Stripe session completed event by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/679
* feat: Track pdf templates Posthog events by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/680
* fix: Branding customize content by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/681
* feat: Listen to Stripe integration events by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/682
* feat: Hook up customer/company address to invoice preview of payment page by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/683

# [0.19.17]

* fix: Un-categorize bank transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/663

# [0.19.16]

* feat: Tracking more Posthog events by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/653
* fix: Expense cannot accept credit card as payment account by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/654
* fix: Suspense the lazy loaded components in banking pages by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/657
* feat: Add help dropdown menu by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/656
* feat: Bank pages layout breaking by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/658
* feat: Datatable UI improvements by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/655
* fix: Array cast of recognize function rule ids by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/660
* fix: Payment made filling the form full amount field by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/661
* feat: Tabular number of all money columns by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/659
* refactor: The expense G/L writer by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/662

## [0.19.15] - 

* fix: Bank transactions infinity scrolling by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/648
* feat: Integrate multiple branches and warehouses to resource importing by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/645
* fix: Integrate multiple branches with expense resource by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/649
* feat: Cover more tracking events. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/650
* feat: Track banking service events by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/651

## [0.19.14]

* fix: Import bugs by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/643
* fix: Set default index to transaction entries by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/644
* feat(server): Events tracking using Posthog by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/646

## [0.19.13]

* fix: Subscription middleware by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/624
* fix: Getting the sheet columns in import sheet by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/641

## [0.19.12]

* fix: Typo one-click demo page by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/640

## [0.19.11]

* fix: Avoid running the cost job in import preview by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/635
* fix: Debounce scheduling calculating items cost by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/634
* fix: Expand the resources export page size limitation by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/636
* feat: Optimize loading perf. by splitting big chunks and lazy loading them by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/632
* fix: Use standard ISO 8601 format for exported data by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/638
* fix: Add customer type to customers resource by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/639

## [0.19.10]

* fix: Add subscription plans offer text by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/629

## [0.19.9]

* fix: Make webapp package env variables dynamic by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/628

## [v0.19.8]

* fix: Cannot import items income and cost accounts by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/617
* fix: Some bank account details hidden by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/618
* feat(ee): One-click demo account by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/616
* feat: change banking service language by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/619
* feat(banking): Filter uncategorized bank transactions by date by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/590
* Fix: Syntax error caused error by @wolone in https://github.com/bigcapitalhq/bigcapital/pull/622
* fix: Listen to payment webhooks by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/623
* fix: Add prefix J-00001 to manual journals increments by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/625
* fix: Disable sms service until Twilo integration by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/626
* fix: Style tweaks in onboarding page by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/627

## [0.19.5] - 18-08-2024

* fix: Allow multi-lines to statements transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/594
* feat: Add amount comparators to amount bank rule field by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/595
* fix: Transaction type and description do not show in general ledger. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/596
* fix: Refresh accounts and account transactions. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/597
* fix: Typo payments made by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/598
* fix: Typo categories list by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/600
* fix: Autofill the quick created customer/vendor by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/601
* fix: Remove views tabs from receipts list by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/602
* fix: Typo payment receive messages by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/599
* fix: Enhance Dropzone visual of  accept and reject modes by @Champetaman in https://github.com/bigcapitalhq/bigcapital/pull/603
* fix:  Matching bank transactions should create associate payment transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/606
* fix: Change Dropzone title and subtitle by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/607
* fix: Inconsistance page size of paginated data tables by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/604
* fix: Database connection lost error by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/611
* fix: Language typos by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/613
* Fix: Correctly display Date, Published At, and Created At in ExpenseDrawerHeader by @Champetaman in https://github.com/bigcapitalhq/bigcapital/pull/612
* fix: Delete bank account with uncategorized transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/614
* feat: activate/inactivate account from drawer details by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/615

## [v0.19.4]

* feat: Import and export tax rates by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/591
* feat: Un-categorize bank transactions in bulk by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/587
* feat: Pending bank transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/589
* fix: Update `dev` Script in `package.json` to Use `cross-env` by @Champetaman in https://github.com/bigcapitalhq/bigcapital/pull/588
* fix: Should not load branches on reconcile matching form if the branches not enabled by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/592
* fix: Rounding the total amount the pending and matched transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/593

## [v0.18.0] - 10-08-2024

* feat: Bank rules for automated categorization by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/511
* feat: Categorize & match bank transaction by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/511
* feat: Reconcile match transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/522
* fix: Issues in matching transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/523
* fix: Cashflow transactions types by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/524

## [v0.17.5] - 17-06-2024

* fix: Balance sheet and P/L nested accounts by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/501
* fix: add space between buttons on floating actions bar by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/508
* feat: Migrating to Envoy proxy instead of Nginx by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/509
* fix: Disable email confirmation does not work with invited users by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/497
* feat: Setting up the date format in the whole system dates by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/506

## [0.17.0] - 04-06-2024

### New

* feat: Upload and attach documents by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/461
* feat: Export resource tables to pdf by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/460
* feat: Build and deploy develop Docker container by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/476
* feat: Internal docker virtual network by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/478

### Fixes

* fix: Skip send confirmation email if disabled by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/459
* fix: Lemon Squeezy redirect to base url by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/479
* fix: Organize Plaid env variables for development and sandbox envs by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/480
* fix: Plaid syncs deposit imports as withdrawals by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/481
* fix: Validate the s3 configures exist by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/482
* fix: Run migrations only for initialized tenants by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/484

## [0.16.16] - 

* feat: handle http exceptions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/456
* feat: add the missing Newrelic env vars to docker-compose.prod file by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/457
* fix: add the signup email confirmation env var by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/458

## [0.16.14] - 

* fix: Typo in setup wizard by @ccantrell72 in https://github.com/bigcapitalhq/bigcapital/pull/440
* fix: Showing the real mail address on email confirmation view by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/445
* fix: Auto-increment setting parsing by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/453

## [0.16.12] - 

* feat: Create a manifest list for `webapp` Docker image and push it to DockerHub. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/436
* feat: Combine arm64 and amd64 in one Github action runner by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/437

## [0.16.11] - 06-05-2024

### improvements

* feat: Export resource data to csv, xlsx by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/430
* feat: User email verification after signing-up. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/426

### Fixes
* feat(repo): upgrade to latest lerna v8 and pnpm v9 by @benpsnyder in https://github.com/bigcapitalhq/bigcapital/pull/414
* feat: Update Docker Build-Push Action and Add ARM64 Support by @cloudsbird in https://github.com/bigcapitalhq/bigcapital/pull/412
* feat: Pushing docker containers by version tag by @cloudsbird in https://github.com/bigcapitalhq/bigcapital/pull/421

## [0.16.10]

* fix: Running migration Docker container on Windows by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/432

## [0.16.9]

* feat: New Relic for tracking by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/429

## [0.16.8]

* feat: Ability to enable/disable the bank connect feature by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/423

## [0.16.6]

* hotfix: fix the subscription plan when subscribe on cloud by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/422

## [0.16.5]

IMPORTANT: If you upgraded to the v0.16 recently you should upgrade to v0.16.4 as soon as possible, because there're some breaking changes affected the sign-in and some users reported couldn't sign-in.

* feat: Seed free subscription to tenants that have no subscription. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/410

## [0.16.3]

* feat: Integrate Lemon Squeezy payment by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/402
* feat: optimize the onboarding subscription experience. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/404
* feat: subscription page content by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/405
* feat: auto subscribe to free plan once signup on community version. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/406
* chore: add default value to env variable by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/407
* fix: absolute storage imports path. by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/408

## [0.16.0]

* feat: add convert to invoice button on estimate drawer toolbar by @ANasouf in https://github.com/bigcapitalhq/bigcapital/pull/361
* feat(webapp): add mark as delivered to action bar of invoice details … by @ANasouf in https://github.com/bigcapitalhq/bigcapital/pull/360
* feat(webapp): Dialog to choose the bank service provider by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/378
* feat: Categorize the bank synced transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/377
* feat: uncategorize the cashflow transaction by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/381
* Import resources from csv/xlsx by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/382
* feat(webapp): import resource UI by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/386
* fix: import resources improvements by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/388
* feat: add sample sheet to accounts and bank transactions by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/389
* fix: show the unique row value in the import preview by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/392
* feat: advanced parser for numeric and boolean import values by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/394
* feat: validate the given imported sheet whether is empty by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/395
* feat: linking relation with id in importing by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/393
* feat: Aggregate rows import by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/396
* feat: clean up the imported temp files by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/400
* feat: add hints to import fields by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/401

## [0.15.0]

* feat: Printing financial reports by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/363
* feat: Convert invoice status after sending mail notification by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/332
* feat: Bigcapital <> Plaid Integration by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/346
* fix: Broken transactions by vendor report by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/369
* fix: Optimize the print style some financial reports by @abouolia in https://github.com/bigcapitalhq/bigcapital/pull/370

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
