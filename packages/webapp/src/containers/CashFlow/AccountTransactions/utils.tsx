import {
  Button,
  PopoverInteractionKind,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React from 'react';
import type { ItemRenderer } from '@blueprintjs/select';
import { Icon } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { handleViewTransactionDetail } from '@/containers/FinancialStatements/utils/transactionDrawer';

export interface CashFlowMenuItem {
  name: string;
  label?: string;
  value?: string;
}

interface CashFlowMenuItemsProps {
  text: React.ReactNode;
  items: CashFlowMenuItem[];
  onItemSelect?: (item: CashFlowMenuItem) => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

export const CashFlowMenuItems = ({
  text,
  items,
  onItemSelect,
  buttonProps,
}: CashFlowMenuItemsProps) => {
  // Menu items renderer.
  const itemsRenderer: ItemRenderer<CashFlowMenuItem> = (
    item,
    { handleClick },
  ) => <MenuItem text={item.name} label={item.label} onClick={handleClick} />;

  const handleCashFlowMenuSelect = (item: CashFlowMenuItem) => {
    onItemSelect?.(item);
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

interface CashFlowTransactionReference {
  referenceType: string;
  referenceId: number;
}

type OpenDrawer = (name: string, payload?: Record<string, unknown>) => void;

export const handleCashFlowTransactionType = (
  reference: CashFlowTransactionReference,
  openDrawer: OpenDrawer,
) => {
  return handleViewTransactionDetail(
    reference,
    openDrawer,
    DRAWERS.CASHFLOW_TRNASACTION_DETAILS,
  );
};
