// @ts-nocheck
import React, { lazy } from 'react';
import { FormattedMessage as T } from '@/components';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ContactDialogContent = lazy(() =>
  import('./ContactDuplicateDialogContent'),
);
/**
 * Contact duplicate dialog.
 */
function ContactDuplicateDialog({ dialogName, payload, isOpen }) {
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

export default compose(withDialogRedux())(ContactDuplicateDialog);
