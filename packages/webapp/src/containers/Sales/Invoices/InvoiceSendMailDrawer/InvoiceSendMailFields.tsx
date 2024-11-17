// @ts-nocheck
import { Button, Intent, MenuItem, Position } from '@blueprintjs/core';
import { useRef, useState, useMemo, useCallback } from 'react';
import { useFormikContext } from 'formik';
import { SelectOptionProps } from '@blueprintjs-formik/select';
import { css } from '@emotion/css';
import {
  FCheckbox,
  FFormGroup,
  FInputGroup,
  Group,
  Stack,
} from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { useInvoiceMailItems, } from './_hooks';
import { SendMailViewToAddressField } from '../../Estimates/SendMailViewDrawer/SendMailViewToAddressField';
import { SendMailViewMessageField } from '../../Estimates/SendMailViewDrawer/SendMailViewMessageField';

export function InvoiceSendMailFields() {
  const items = useInvoiceMailItems();

  return (
    <Stack
      bg="white"
      flex={'1'}
      maxWidth="720px"
      maxHeight="100%"
      spacing={0}
      borderRight="1px solid #dcdcdd"
    >
      <Stack spacing={0} overflow="auto" flex="1" p={'30px'}>
        <SendMailViewToAddressField
          toMultiSelectProps={{ items }}
          ccMultiSelectProps={{ items }}
          bccMultiSelectProps={{ items }}
        />
        <FFormGroup label={'Submit'} name={'subject'}>
          <FInputGroup name={'subject'} large fastField />
        </FFormGroup>

        <SendMailViewMessageField />

        <Group>
          <FCheckbox name={'attachPdf'} label={'Attach PDF'} />
        </Group>
      </Stack>

      <InvoiceSendMailFooter />
    </Stack>
  );
}

function InvoiceSendMailFooter() {
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
