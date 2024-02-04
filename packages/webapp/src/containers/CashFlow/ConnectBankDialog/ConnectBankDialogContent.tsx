import { Button } from '@blueprintjs/core';
import { FFormGroup, FSelect } from '@/components';
import { useFormikContext } from 'formik';

export function ConnectBankDialogContent() {
  const { isSubmitting } = useFormikContext();

  return (
    <div>
      <FFormGroup
        label={'Banking Syncing Service Provider'}
        name={'serviceProvider'}
      >
        <FSelect
          name={'serviceProvider'}
          valueAccessor={'key'}
          textAccessor={'label'}
          popoverProps={{ minimal: true }}
          items={BankFeedsServiceProviders}
        />
      </FFormGroup>

      <Button type={'submit'} loading={isSubmitting}>
        Connect
      </Button>
    </div>
  );
}

export const BankFeedsServiceProviders = [{ label: 'Plaid', key: 'plaid' }];
