

export default {
  /**
   * Authentication service.
   */
  auth: {
    login: 'onLogin',
    register: 'onRegister',
    sendResetPassword: 'onSendResetPassword',
    resetPassword: 'onResetPassword',
  },

  /**
   * Invite users service.
   */
  inviteUser: {
    acceptInvite: 'onUserAcceptInvite',
    sendInvite: 'onUserSendInvite',
    checkInvite: 'onUserCheckInvite'
  },

  /**
   * Organization managment service.
   */
  organization: {
    build: 'onOrganizationBuild',
    seeded: 'onOrganizationSeeded',
  },

  /**
   * Tenants managment service.
   */
  tenantManager: {
    databaseCreated: 'onDatabaseCreated',
    tenantMigrated: 'onTenantMigrated',
    tenantSeeded: 'onTenantSeeded',
  },

  /**
   * Accounts service.
   */
  accounts: {
    onCreated: 'onAccountCreated',
    onEdited: 'onAccountEdited',
    onDeleted: 'onAccountDeleted',
    onBulkDeleted: 'onBulkDeleted',
    onBulkActivated: 'onAccountBulkActivated',
    onActivated: 'onAccountActivated'
  },

  /**
   * Manual journals service.
   */
  manualJournals: {
    onCreated: 'onManualJournalCreated',
    onEdited: 'onManualJournalEdited',
    onDeleted: 'onManualJournalDeleted',
    onDeletedBulk: 'onManualJournalCreatedBulk',
    onPublished: 'onManualJournalPublished',
    onPublishedBulk: 'onManualJournalPublishedBulk',
  },

  /**
   * Expenses service.
   */
  expenses: {
    onCreated: 'onExpenseCreated',
    onEdited: 'onExpenseEdited',
    onDeleted: 'onExpenseDelted',
    onPublished: 'onExpensePublished',

    onBulkDeleted: 'onExpenseBulkDeleted',
    onBulkPublished: 'onBulkPublished',
  }
}
