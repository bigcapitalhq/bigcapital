import React from 'react';
import intl from 'react-intl-universal';
import { ReceiptFormHeader as ReceiptFormHeaderFields } from './ReceiptFormHeaderFields';
import { useReceiptTotalFormatted } from './utils';
import type { CSSProperties } from 'react';
import { Group, PageFormBigNumber } from '@/components';
import { useIsDarkMode } from '@/hooks/useDarkMode';

const headerStyle = (isDarkMode: boolean): CSSProperties =>
  ({
    '--x-header-background': isDarkMode
      ? 'var(--color-dark-gray1)'
      : 'var(--color-white)',
    '--x-header-border': isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#d2dce2',
  }) as CSSProperties;

/**
 * Receipt form header section.
 */
export function ReceiptFormHeader() {
  const isDarkMode = useIsDarkMode();

  return (
    <Group
      position="apart"
      align={'flex-start'}
      display="flex"
      p="25px 32px"
      bg="var(--x-header-background)"
      borderBottom="1px solid var(--x-header-border)"
      style={headerStyle(isDarkMode)}
    >
      <ReceiptFormHeaderFields />
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
