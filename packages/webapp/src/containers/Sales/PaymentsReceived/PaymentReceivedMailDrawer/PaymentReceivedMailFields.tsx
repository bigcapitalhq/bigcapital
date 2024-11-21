// @ts-nocheck
import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FCheckbox, FFormGroup, FInputGroup, Group, Stack } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { SendMailViewToAddressField } from '../../Estimates/SendMailViewDrawer/SendMailViewToAddressField';
import { SendMailViewMessageField } from '../../Estimates/SendMailViewDrawer/SendMailViewMessageField';
import { usePaymentReceivedFormatArgsOptions, } from './_hooks';
import { useSendMailItems } from '../../Estimates/SendMailViewDrawer/hooks';

export function PaymentReceivedSendMailFields() {
  const argsOptions = usePaymentReceivedFormatArgsOptions();
  const items = useSendMailItems();

  return (
    <Stack flex={1}>
      <Stack spacing={0} overflow="auto" flex="1" p={'30px'}>
        <SendMailViewToAddressField
          toMultiSelectProps={{ items }}
          ccMultiSelectProps={{ items }}
          bccMultiSelectProps={{ items }}
        />
        <FFormGroup label={'Submit'} name={'subject'}>
          <FInputGroup name={'subject'} large fastField />
        </FFormGroup>

        <SendMailViewMessageField argsOptions={argsOptions} />

        <Group>
          <FCheckbox name={'attachPdf'} label={'Attach PDF'} />
        </Group>
      </Stack>

      <PaymentReceivedSendMailFooter />
    </Stack>
  );
}

function PaymentReceivedSendMailFooter() {
  const { isSubmitting } = useFormikContext();
  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const handleClose = () => {
    closeDrawer(name);
  };

  return (
    <Group
      py={'12px'}
      px={'16px'}
      borderTop="1px solid #d8d8d9"
      position={'apart'}
    >
      <Group spacing={10} ml={'auto'}>
        <Button
          disabled={isSubmitting}
          onClick={handleClose}
          style={{ minWidth: '65px' }}
        >
          Close
        </Button>

        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '85px' }}
          type="submit"
        >
          Send Mail
        </Button>
      </Group>
    </Group>
  );
}
