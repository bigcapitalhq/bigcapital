import { useState } from 'react';
import { Button, DialogBody, DialogFooter, Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import { Stack } from '@/components';
import { useDialogContext } from '@/components/Dialog/DialogProvider';
import { useDialogActions } from '@/hooks/state';
import { CreditCard2Icon } from '@/icons/CreditCard2';
import { DollarIcon } from '@/icons/Dollar';
import { LayoutAutoIcon } from '@/icons/LayoutAuto';
import { SwitchIcon } from '@/icons/SwitchIcon';
import { usePaymentMethodsBoot } from '../../PreferencesPaymentMethodsBoot';

export function StripePreSetupDialogContent() {
  const { name } = useDialogContext();
  const { closeDialog } = useDialogActions();
  const { paymentMethodsState } = usePaymentMethodsBoot();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleSetUpBtnClick = () => {
    if (paymentMethodsState?.stripe.stripeAuthLink) {
      setIsRedirecting(true);
      window.location.href = paymentMethodsState?.stripe.stripeAuthLink;
    }
  };
  // Handle cancel button click.
  const handleCancelBtnClick = () => {
    closeDialog(name);
  };

  return (
    <>
      <DialogBody>
        <Stack style={{ paddingTop: 10, paddingBottom: 20 }}>
          <PaymentFeatureItem>
            <PaymentFeatureIcon>
              <LayoutAutoIcon size={16} />
            </PaymentFeatureIcon>{' '}
            If you're already using Stripe, you can connect your Stripe account
            to Bigcapital.
          </PaymentFeatureItem>

          <PaymentFeatureItem>
            <PaymentFeatureIcon>
              <DollarIcon size={16} />
            </PaymentFeatureIcon>{' '}
            Stripe applies a processing fee for each card payment, but we only
            charge for the application subscription.
          </PaymentFeatureItem>

          <PaymentFeatureItem>
            <PaymentFeatureIcon>
              <CreditCard2Icon size={16} />
            </PaymentFeatureIcon>{' '}
            Customers can pay invoice using credit card, debit card or digital
            wallets like Apple Pay or Google Pay.
          </PaymentFeatureItem>

          <PaymentFeatureItem>
            <PaymentFeatureIcon>
              <SwitchIcon size={16} />
            </PaymentFeatureIcon>{' '}
            You can enable or disable card payments for each invoice
          </PaymentFeatureItem>
        </Stack>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button onClick={handleCancelBtnClick}>Cancel</Button>
            <Button
              intent={Intent.PRIMARY}
              onClick={handleSetUpBtnClick}
              loading={isRedirecting}
            >
              Set Up Stripe
            </Button>
          </>
        }
      ></DialogFooter>
    </>
  );
}

const PaymentFeatureItem = styled('div')`
  padding-left: 20px;
  position: relative;
  padding-left: 50px;
`;

const PaymentFeatureIcon = styled('span')`
  position: absolute;
  left: 12px;
  top: 2px;
  color: #0052cc;
`;
