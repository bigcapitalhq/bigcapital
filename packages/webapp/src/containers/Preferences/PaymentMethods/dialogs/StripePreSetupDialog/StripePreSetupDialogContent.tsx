import {
  useCreateStripeAccount,
  useCreateStripeAccountLink,
} from '@/hooks/query/stripe-integration';
import { Button, DialogBody, DialogFooter, Intent } from '@blueprintjs/core';

export function StripePreSetupDialogContent() {
  const {
    mutateAsync: createStripeAccount,
    isLoading: isCreateStripeAccountLoading,
  } = useCreateStripeAccount();

  const {
    mutateAsync: createStripeAccountLink,
    isLoading: isCreateStripeLinkLoading,
  } = useCreateStripeAccountLink();

  const handleSetUpBtnClick = () => {
    createStripeAccount({})
      .then((response) => {
        const { account_id: accountId } = response;

        return createStripeAccountLink({ stripeAccountId: accountId });
      })
      .then((res) => {
        const { clientSecret } = res;

        if (clientSecret.url) {
          window.location.href = clientSecret.url;
        }
      });
  };

  const isLoading = isCreateStripeAccountLoading || isCreateStripeLinkLoading;

  return (
    <>
      <DialogBody>

        
      </DialogBody>
      <DialogFooter
        actions={
          <Button
            intent={Intent.PRIMARY}
            onClick={handleSetUpBtnClick}
            loading={isLoading}
          >
            Set It Up
          </Button>
        }
      ></DialogFooter>
    </>
  );
}
