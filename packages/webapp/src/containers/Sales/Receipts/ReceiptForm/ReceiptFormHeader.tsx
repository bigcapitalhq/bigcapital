// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Group, PageFormBigNumber } from '@/components';
import ReceiptFormHeaderFields from './ReceiptFormHeaderFields';
import { useReceiptTotalFormatted } from './utils';
import { useIsDarkMode } from '@/hooks/useDarkMode';

/**
 * Receipt form header section.
 */
function ReceiptFormHeader({
  // #ownProps
  onReceiptNumberChanged,
}) {
  const isDarkMode = useIsDarkMode();

  return (
    <Group
      position="apart"
      align={'flex-start'}
      display="flex"
      p="25px 32px"
      bg="var(--x-header-background)"
      borderBottom="1px solid var(--x-header-border)"
      style={{
        '--x-header-background': isDarkMode
          ? 'var(--color-dark-gray1)'
          : 'var(--color-white)',
        '--x-header-border': isDarkMode
          ? 'rgba(255, 255, 255, 0.1)'
          : '#d2dce2',
      }}
    >
      <ReceiptFormHeaderFields
        onReceiptNumberChanged={onReceiptNumberChanged}
      />
      <ReceiptFormHeaderBigTotal />
    </Group>
  );
}

/**
 * The big total amount of receipt form.
 * @returns {React.ReactNode}
 */
function ReceiptFormHeaderBigTotal() {
  const totalFormatted = useReceiptTotalFormatted();

  return (
    <PageFormBigNumber label={intl.get('due_amount')} amount={totalFormatted} />
  );
}

export default ReceiptFormHeader;
