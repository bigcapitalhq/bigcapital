// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Group, PageFormBigNumber } from '@/components';
import ReceiptFormHeaderFields from './ReceiptFormHeaderFields';
import { useReceiptTotalFormatted } from './utils';

/**
 * Receipt form header section.
 */
function ReceiptFormHeader({
  // #ownProps
  onReceiptNumberChanged,
}) {
  return (
    <Group
      position="apart"
      align={'flex-start'}
      display="flex"
      bg="white"
      p="25px 32px"
      borderBottom="1px solid #d2dce2"
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
