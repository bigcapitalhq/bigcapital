export const ERRORS = {
  NOT_FOUND: 'manual_journal_not_found',
  CREDIT_DEBIT_NOT_EQUAL_ZERO: 'credit_debit_not_equal_zero',
  CREDIT_DEBIT_NOT_EQUAL: 'credit_debit_not_equal',
  ACCOUNTS_IDS_NOT_FOUND: 'accounts_ids_not_found',
  JOURNAL_NUMBER_EXISTS: 'journal_number_exists',
  ENTRIES_SHOULD_ASSIGN_WITH_CONTACT: 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT',
  CONTACTS_NOT_FOUND: 'contacts_not_found',
  ENTRIES_CONTACTS_NOT_FOUND: 'ENTRIES_CONTACTS_NOT_FOUND',
  MANUAL_JOURNAL_ALREADY_PUBLISHED: 'MANUAL_JOURNAL_ALREADY_PUBLISHED',
  MANUAL_JOURNAL_NO_REQUIRED: 'MANUAL_JOURNAL_NO_REQUIRED',
  COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS:
    'COULD_NOT_ASSIGN_DIFFERENT_CURRENCY_TO_ACCOUNTS',
  MANUAL_JOURNAL_ENTRIES_HAVE_NO_BRANCH_ID:
    'MANUAL_JOURNAL_ENTRIES_HAVE_NO_BRANCH_ID',
};

export const CONTACTS_CONFIG = [
  {
    accountBySlug: 'accounts-receivable',
    contactService: 'customer',
    assignRequired: true,
  },
  {
    accountBySlug: 'accounts-payable',
    contactService: 'vendor',
    assignRequired: true,
  },
];

export const DEFAULT_VIEWS = [];

export const ManualJournalsSampleData = [
  {
    Date: '2024-02-02',
    'Journal No': 'J-100022',
    'Reference No.': 'REF-10000',
    'Currency Code': '',
    'Exchange Rate': '',
    'Journal Type': '',
    Description: 'Animi quasi qui itaque aut possimus illum est magnam enim.',
    Credit: 1000,
    Debit: 0,
    Note: 'Qui reprehenderit voluptate.',
    Account: 'Bank Account',
    Contact: '',
    Publish: 'T',
  },
  {
    Date: '2024-02-02',
    'Journal No': 'J-100022',
    'Reference No.': 'REF-10000',
    'Currency Code': '',
    'Exchange Rate': '',
    'Journal Type': '',
    Description: 'In assumenda dicta autem non est corrupti non et.',
    Credit: 0,
    Debit: 1000,
    Note: 'Omnis tempora qui fugiat neque dolor voluptatem aut repudiandae nihil.',
    Account: 'Bank Account',
    Contact: '',
    Publish: 'T',
  },
];
