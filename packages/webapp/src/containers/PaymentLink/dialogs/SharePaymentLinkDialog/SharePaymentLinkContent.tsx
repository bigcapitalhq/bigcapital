import { DialogBody } from '@blueprintjs/core';
import { SharePaymentLinkForm } from './SharePaymentLinkForm';
import { SharePaymentLinkFormContent } from './SharePaymentLinkFormContent';
import { SharePaymentLinkProvider } from './SharePaymentLinkProvider';

export function SharePaymentLinkContent() {
  return (
    <DialogBody>
      <SharePaymentLinkProvider>
        <SharePaymentLinkForm>
          <SharePaymentLinkFormContent />
        </SharePaymentLinkForm>
      </SharePaymentLinkProvider>
    </DialogBody>
  );
}
