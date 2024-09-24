import { SharePaymentLinkForm } from './SharePaymentLinkForm';
import { SharePaymentLinkFormContent } from './SharePaymentLinkFormContent';
import { SharePaymentLinkProvider } from './SharePaymentLinkProvider';

export function SharePaymentLinkContent() {
  return (
    <SharePaymentLinkProvider>
      <SharePaymentLinkForm>
        <SharePaymentLinkFormContent />
      </SharePaymentLinkForm>
    </SharePaymentLinkProvider>
  );
}
