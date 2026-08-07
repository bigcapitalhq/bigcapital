import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { PaymentReceiveHeaderFields } from './PaymentReceiveHeaderFields';
import type { PaymentReceiveFormValues } from './utils';
import { Group, Money } from '@/components';
import { FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useIsDarkMode } from '@/hooks/useDarkMode';

/**
 * Payment receive form header.
 */
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

/**
 * Big total amount of payment receive form.
 */
function PaymentReceiveFormBigTotal() {
  const {
    values: { currencyCode, amount },
  } = useFormikContext<PaymentReceiveFormValues>();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_BIG_NUMBERS)}>
      <div className="big-amount">
        <span className="big-amount__label">
          <T id={'amount_received'} />
        </span>
        <h1 className="big-amount__number">
          <Money amount={amount} currency={currencyCode} />
        </h1>
      </div>
    </div>
  );
}
