// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import { useActivateContact } from '@/hooks/query';

import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { flow } from 'fp-ts/function';

/**
 *  Contact activate alert.
 */
function ContactActivateAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { contactId, service },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: activateContact, isLoading } = useActivateContact();

  // Handle activate contact alert cancel.
  const handleCancelActivateContact = () => {
    closeAlert(name);
  };

  // Handle confirm contact activated.
  const handleConfirmContactActivate = () => {
    activateContact(contactId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_contact_has_been_activated_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'activate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelActivateContact}
      loading={isLoading}
      onConfirm={handleConfirmContactActivate}
    >
      <p>{intl.get('are_sure_to_activate_this_contact')}</p>
    </Alert>
  );
}

export const ContactActivateAlert = flow(
  withAlertActions,
  withAlertStoreConnect(),
)(ContactActivateAlertInner);
