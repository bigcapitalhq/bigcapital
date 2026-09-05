import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import React from 'react';
import { PaymentReceiveHeaderFields } from './PaymentReceiveHeaderFields';
import type { PaymentReceiveFormValues } from './utils';
import { Group, PageFormBigNumber } from '@/components';
import { formattedAmount } from '@/utils';
import { useIsDarkMode } from '@/hooks/useDarkMode';

export function PaymentReceiveFormHeader() {
  const isDarkMode = useIsDarkMode();

  const headerStyle = {
    '--x-header-background': isDarkMode
      ? 'var(--color-dark-gray1)'
      : 'var(--color-white)',
    '--x-header-border': isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#d2dce2',
  } as React.CSSProperties;

  return (
    <Group
      position="apart"
      align={'flex-start'}
      p="25px 32px"
      bg="var(--x-header-background)"
      borderBottom="1px solid var(--x-header-border)"
      style={headerStyle}
    >
      <PaymentReceiveHeaderFields />
      <PaymentReceiveFormBigTotal />
    </Group>
  );
}

function PaymentReceiveFormBigTotal() {
  const {
    values: { currencyCode, amount },
  } = useFormikContext<PaymentReceiveFormValues>();

  const formatted = formattedAmount(amount, currencyCode);

  return (
    <PageFormBigNumber label={intl.get('amount_received')} amount={formatted} />
  );
}
