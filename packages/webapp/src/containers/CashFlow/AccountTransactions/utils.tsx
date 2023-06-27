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
import { DRAWERS } from '@/constants/drawers';

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
      return openDrawer(DRAWERS.RECEIPT_DETAILS, {
        receiptId: reference.reference_id,
      });
    case 'Journal':
      return openDrawer(DRAWERS.JOURNAL_DETAILS, {
        manualJournalId: reference.reference_id,
      });
    case 'Expense':
      return openDrawer(DRAWERS.EXPENSE_DETAILS, {
        expenseId: reference.reference_id,
      });
    case 'PaymentReceive':
      return openDrawer(DRAWERS.PAYMENT_RECEIVE_DETAILS, {
        paymentReceiveId: reference.reference_id,
      });
    case 'BillPayment':
      return openDrawer(DRAWERS.PAYMENT_MADE_DETAILS, {
        paymentMadeId: reference.reference_id,
      });
    case 'RefundCreditNote':
      return openDrawer(DRAWERS.REFUND_CREDIT_NOTE_DETAILS, {
        refundTransactionId: reference.reference_id,
      });
    case 'RefundVendorCredit':
      return openDrawer(DRAWERS.REFUND_VENDOR_CREDIT_DETAILS, {
        refundTransactionId: reference.reference_id,
      });
    case 'InventoryAdjustment':
      return openDrawer(DRAWERS.INVENTORY_ADJUSTMENT_DETAILS, {
        inventoryId: reference.reference_id,
      });

    default:
      return openDrawer(DRAWERS.CASHFLOW_TRANSACTION_DETAILS, {
        referenceId: reference.reference_id,
      });
  }
};
