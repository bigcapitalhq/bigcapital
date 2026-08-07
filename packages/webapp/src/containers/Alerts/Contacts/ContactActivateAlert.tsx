import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useActivateContact } from '@/hooks/query';
import { compose } from '@/utils';

interface ContactActivateAlertPayload {
  contactId: number;
}

interface ContactActivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: ContactActivateAlertPayload;
}

/**
 *  Contact activate alert.
 */
function ContactActivateAlertInner({
  name,
  isOpen,
  payload: { contactId },
  closeAlert,
}: ContactActivateAlertProps): React.ReactElement {
  const { mutateAsync: activateContact, isPending: isLoading } =
    useActivateContact();

  const handleCancelActivateContact = () => {
    closeAlert(name);
  };

  const handleConfirmContactActivate = () => {
    activateContact(contactId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_contact_has_been_activated_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch((error) => {})` that silently swallowed failures.
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('activate')}
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

export const ContactActivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ContactActivateAlertInner);
