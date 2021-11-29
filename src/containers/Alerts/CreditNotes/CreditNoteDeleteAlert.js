import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, FormattedHTMLMessage } from 'components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

/**
 * Credit note delete alert.
 */
function CreditNoteDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { creditNoteId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  // handle cancel delete credit note alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };
  const handleConfirmCreditNoteDelete = () => {};

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmCreditNoteDelete}
      // loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage id={'credit_note.once_delete_this_credit_note'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(CreditNoteDeleteAlert);
