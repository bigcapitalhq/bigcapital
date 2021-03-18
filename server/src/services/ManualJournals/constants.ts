export const ERRORS = {
  NOT_FOUND: 'manual_journal_not_found',
  CREDIT_DEBIT_NOT_EQUAL_ZERO: 'credit_debit_not_equal_zero',
  CREDIT_DEBIT_NOT_EQUAL: 'credit_debit_not_equal',
  ACCCOUNTS_IDS_NOT_FOUND: 'acccounts_ids_not_found',
  JOURNAL_NUMBER_EXISTS: 'journal_number_exists',
  ENTRIES_SHOULD_ASSIGN_WITH_CONTACT: 'ENTRIES_SHOULD_ASSIGN_WITH_CONTACT',
  CONTACTS_NOT_FOUND: 'contacts_not_found',
  ENTRIES_CONTACTS_NOT_FOUND: 'ENTRIES_CONTACTS_NOT_FOUND',
  MANUAL_JOURNAL_ALREADY_PUBLISHED: 'MANUAL_JOURNAL_ALREADY_PUBLISHED',
  MANUAL_JOURNAL_NO_REQUIRED: 'MANUAL_JOURNAL_NO_REQUIRED'
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
