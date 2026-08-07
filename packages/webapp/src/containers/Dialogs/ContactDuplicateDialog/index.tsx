import React, { lazy } from 'react';
import type { ContactDuplicateDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ContactDialogContent = lazy(() =>
  import('./ContactDuplicateDialogContent').then((m) => ({
    default: m.ContactDuplicateDialogContent,
  })),
);

interface ContactDuplicateDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: ContactDuplicateDialogPayload;
}

/**
 * Contact duplicate dialog.
 */
function ContactDuplicateDialog({
  dialogName,
  payload,
  isOpen,
}: ContactDuplicateDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'duplicate_contact'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      className={'dialog--contact-duplicate'}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <ContactDialogContent
          dialogName={dialogName}
          contact={payload.contactId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = compose(withDialogRedux())(ContactDuplicateDialog);
