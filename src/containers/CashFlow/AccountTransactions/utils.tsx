// @ts-nocheck
import React from 'react';
import {
  Button,
  PopoverInteractionKind,
  MenuItem,
  Position,
} from '@blueprintjs/core';

import { Select } from '@blueprintjs/select';
import { Icon } from '@/components';

export const CashFlowMenuItems = ({
  text,
  items,
  onItemSelect,
  buttonProps,
}) => {
  // Menu items renderer.
  const itemsRenderer = (item, { handleClick, modifiers, query }) => (
    <MenuItem text={item.name} label={item.label} onClick={handleClick} />
  );

  const handleCashFlowMenuSelect = (type) => {
    onItemSelect && onItemSelect(type);
  };

  return (
    <Select
      items={items}
      itemRenderer={itemsRenderer}
      onItemSelect={handleCashFlowMenuSelect}
      popoverProps={{
        minimal: true,
        position: Position.BOTTOM_LEFT,
        interactionKind: PopoverInteractionKind.CLICK,
        modifiers: {
          offset: { offset: '0, 4' },
        },
      }}
      filterable={false}
    >
      <Button
        text={text}
        icon={<Icon icon={'plus-24'} iconSize={20} />}
        minimal={true}
        {...buttonProps}
      />
    </Select>
  );
};

export const handleCashFlowTransactionType = (reference, openDrawer) => {
  switch (reference.reference_type) {
    case 'SaleReceipt':
      return openDrawer('receipt-detail-drawer', {
        receiptId: reference.reference_id,
      });
    case 'Journal':
      return openDrawer('journal-drawer', {
        manualJournalId: reference.reference_id,
      });
    case 'Expense':
      return openDrawer('expense-drawer', {
        expenseId: reference.reference_id,
      });
    case 'PaymentReceive':
      return openDrawer('payment-receive-detail-drawer', {
        paymentReceiveId: reference.reference_id,
      });
    case 'BillPayment':
      return openDrawer('payment-made-detail-drawer', {
        paymentMadeId: reference.reference_id,
      });
    case 'RefundCreditNote':
      return openDrawer('refund-credit-detail-drawer', {
        refundTransactionId: reference.reference_id,
      });
    case 'RefundVendorCredit':
      return openDrawer('refund-vendor-detail-drawer', {
        refundTransactionId: reference.reference_id,
      });
    case 'InventoryAdjustment':
      return openDrawer('inventory-adjustment-drawer', {
        inventoryId: reference.reference_id,
      });

    default:
      return openDrawer('cashflow-transaction-drawer', {
        referenceId: reference.reference_id,
      });
  }
};
