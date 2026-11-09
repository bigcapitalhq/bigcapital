import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Tag,
  Intent,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';
import type { VendorCredit } from '@bigcapital/sdk-ts';
import {
  Icon,
  FormattedMessage as T,
  TextOverviewTooltipCell,
  Choose,
} from '@/components';
import { getColumnWidth } from '@/utils';

/**
 * Retrieve vendor credit readonly details entries table columns.
 */
export const useVendorCreditReadonlyEntriesTableColumns = () => {
  const { vendorCredit } = useVendorCreditDetailDrawerContext();
  const entries = vendorCredit?.entries ?? [];
  return React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        Cell: TextOverviewTooltipCell,
        width: 150,
        className: 'item',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: TextOverviewTooltipCell,
        className: 'description',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantityFormatted',
        width: getColumnWidth(entries, 'quantityFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rateFormatted',
        width: getColumnWidth(entries, 'rateFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        id: 'discount',
        Header: 'Discount',
        accessor: 'discountFormatted',
        width: getColumnWidth(entries, 'discountFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('amount'),
        accessor: 'totalFormatted',
        width: getColumnWidth(entries, 'totalFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
    ],
    [entries],
  );
};

interface VendorCreditMenuItemProps {
  payload: {
    onReconcile: () => void;
  };
}

/**
 * Vendor note more actions menu.
 * @returns {React.JSX}
 */
export const VendorCreditMenuItem = ({
  payload: { onReconcile },
}: VendorCreditMenuItemProps) => {
  return (
    <Popover
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      content={
        <Menu>
          <MenuItem
            onClick={onReconcile}
            text={intl.get('vendor_credits.action.reconcile_with_bills')}
          />
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
};

interface VendorCreditDetailsStatusProps {
  vendorCredit: VendorCredit;
}

/**
 * Vendor Credit details status.
 * @returns {React.JSX}
 */
export function VendorCreditDetailsStatus({
  vendorCredit,
}: VendorCreditDetailsStatusProps) {
  return (
    <Choose>
      <Choose.When condition={!!vendorCredit.isOpen}>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'open'} />
        </Tag>
      </Choose.When>

      <Choose.When condition={!!vendorCredit.isClosed}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'closed'} />
        </Tag>
      </Choose.When>

      <Choose.When condition={!!vendorCredit.isDraft}>
        <Tag intent={Intent.NONE} round={true} minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.When>
    </Choose>
  );
}
