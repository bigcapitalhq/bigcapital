import { AccountsSelect, FFormGroup, Group, Stack } from '@/components';
import { useStripeIntegrationEditBoot } from './StripeIntegrationEditBoot';
import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { ACCOUNT_TYPE } from '@/constants';

export function StripeIntegrationEditFormContent() {
  const { accounts } = useStripeIntegrationEditBoot();

  return (
    <Stack spacing={0} style={{ padding: 20 }}>
      <FFormGroup
        name={'bankAccountId'}
        label={'Bank Account'}
        style={{ maxWidth: 300 }}
        helperText={'The bank account where the Stripe payout is deposited.'}
      >
        <AccountsSelect
          name={'bankAccountId'}
          items={accounts}
          filterByTypes={[ACCOUNT_TYPE.CASH, ACCOUNT_TYPE.BANK]}
          fastField
          fill
          allowCreate
        />
      </FFormGroup>

      <FFormGroup
        name={'clearingAccountId'}
        label={'Clearing Account'}
        subLabel='Liability Account'
        helperText={'Clearing account tracks all payments collected through Stripe.'}
        style={{ maxWidth: 300 }}
      >
        <AccountsSelect
          name={'clearingAccountId'}
          items={accounts}
          filterByTypes={[ACCOUNT_TYPE.OTHER_CURRENT_LIABILITY]}
          fastField
          fill
          allowCreate
        />
      </FFormGroup>
    </Stack>
  );
}

export function StripeIntegrationEditFormFooter() {
  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();
  const { submitForm, isSubmitting } = useFormikContext();

  const handleSubmitBtnClick = () => {
    submitForm();
  };
  const handleCancelBtnClick = () => {
    closeDrawer(name);
  };

  return (
    <>
      <Group spacing={10}>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          onClick={handleSubmitBtnClick}
        >
          Save
        </Button>
        <Button onClick={handleCancelBtnClick}>Cancel</Button>
      </Group>
    </>
  );
}
