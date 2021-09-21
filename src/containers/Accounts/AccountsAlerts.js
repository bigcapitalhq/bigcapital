import React from 'react';
import AccountDeleteAlert from 'containers/Alerts/AccountDeleteAlert';
import AccountInactivateAlert from 'containers/Alerts/AccountInactivateAlert';
import AccountActivateAlert from 'containers/Alerts/AccountActivateAlert';
// import AccountBulkDeleteAlert from 'containers/Alerts/AccountBulkDeleteAlert';
// import AccountBulkInactivateAlert from 'containers/Alerts/AccountBulkInactivateAlert';
// import AccountBulkActivateAlert from 'containers/Alerts/AccountBulkActivateAlert';

/**
 * Accounts alert.
 */
export default function AccountsAlerts({

}) {
  return (
    <div class="accounts-alerts">
      <AccountDeleteAlert name={'account-delete'} />
      <AccountInactivateAlert name={'account-inactivate'} />
      <AccountActivateAlert name={'account-activate'} />

      {/* <AccountBulkDeleteAlert name={'accounts-bulk-delete'} />
      <AccountBulkInactivateAlert name={'accounts-bulk-inactivate'} />
      <AccountBulkActivateAlert name={'accounts-bulk-activate'} /> */}
    </div>
  )
}