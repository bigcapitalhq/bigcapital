// @ts-nocheck
import { Classes } from '@blueprintjs/core';
import { DrawerBody, DrawerHeaderContent } from '@/components';
import { StripeIntegrationEditForm } from './StripeIntegrationEditForm';
import { StripeIntegrationEditBoot } from './StripeIntegrationEditBoot';
import {
  StripeIntegrationEditFormContent,
  StripeIntegrationEditFormFooter,
} from './StripeIntegrationEditFormContent';

export function StripeIntegrationEditContent() {
  return (
    <>
      <DrawerHeaderContent title={'Edit Stripe Integration'} />

      <StripeIntegrationEditBoot>
        <StripeIntegrationEditForm>
          <DrawerBody>
            <StripeIntegrationEditFormContent />
          </DrawerBody>

          <div className={Classes.DRAWER_FOOTER}>
            <StripeIntegrationEditFormFooter />
          </div>
        </StripeIntegrationEditForm>
      </StripeIntegrationEditBoot>
    </>
  );
}
