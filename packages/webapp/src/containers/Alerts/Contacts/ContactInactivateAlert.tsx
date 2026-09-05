import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useInactivateContact } from '@/hooks/query';
import { compose } from '@/utils';

interface ContactInactivateAlertPayload {
  contactId: number;
  service: string;
}

interface ContactInactivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: ContactInactivateAlertPayload;
}

/**
 * Contact inactivate alert.
 */
function ContactInactivateAlertInner({
  name,
  isOpen,
  payload: { contactId, service },
  closeAlert,
}: ContactInactivateAlertProps): React.ReactElement {
  const { mutateAsync: inactivateContact, isPending: isLoading } =
    useInactivateContact();

  const handleCancelInactivateContact = () => {
    closeAlert(name);
  };

  const handleConfirmContactInactive = () => {
    inactivateContact(contactId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_contact_has_been_inactivated_successfully'),
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
      confirmButtonText={intl.get('inactivate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelInactivateContact}
      onConfirm={handleConfirmContactInactive}
      loading={isLoading}
    >
      <p>
        {intl.get('are_sure_to_inactive_this_contact', {
          name: service,
        })}
      </p>
    </Alert>
  );
}

export const ContactInactivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ContactInactivateAlertInner);
