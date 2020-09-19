

export default {
  auth: {
    login: 'onLogin',
    register: 'onRegister',
    sendResetPassword: 'onSendResetPassword',
    resetPassword: 'onResetPassword',
  },

  inviteUser: {
    acceptInvite: 'onUserAcceptInvite',
    sendInvite: 'onUserSendInvite',
    checkInvite: 'onUserCheckInvite'
  },

  organization: {
    build: 'onOrganizationBuild',
    seeded: 'onOrganizationSeeded',
  },

  tenantManager: {
    databaseCreated: 'onDatabaseCreated',
    tenantMigrated: 'onTenantMigrated',
    tenantSeeded: 'onTenantSeeded',
  },

  manualJournals: {
    onCreated: 'onManualJournalCreated',
    onEdited: 'onManualJournalEdited',
    onDeleted: 'onManualJournalDeleted',
    onDeletedBulk: 'onManualJournalCreatedBulk',
    onPublished: 'onManualJournalPublished',
    onPublishedBulk: 'onManualJournalPublishedBulk',
  }
}
