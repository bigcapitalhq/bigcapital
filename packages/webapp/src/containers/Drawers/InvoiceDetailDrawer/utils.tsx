import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Intent,
  Tag,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';
import type { SaleInvoice } from '@bigcapital/sdk-ts';
import {
  Icon,
  FormattedMessage as T,
  Choose,
  Can,
  If,
  TextOverviewTooltipCell,
} from '@/components';
import { SaleInvoiceAction, AbilitySubject } from '@/constants/abilityOption';
import { getColumnWidth } from '@/utils';

interface InvoiceDetailsStatusProps {
  invoice: SaleInvoice;
}

interface BadDebtMenuItemPayload {
  onCancelBadDebt: () => void;
  onBadDebt: () => void;
  onNotifyViaSMS: () => void;
  onConvert: () => void;
  onDeliver: () => void;
}

interface BadDebtMenuItemProps {
  payload: BadDebtMenuItemPayload;
}

/**
 * Retrieve invoice readonly details table columns.
 */
export const useInvoiceReadonlyEntriesColumns = () => {
  // Invoice details drawer context.
  const { invoice } = useInvoiceDetailDrawerContext();
  const entries = invoice?.entries ?? [];

  return React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        Cell: TextOverviewTooltipCell,
        disableSortBy: true,
        textOverview: true,
        width: 150,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: TextOverviewTooltipCell,
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantityFormatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'quantityFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'rate', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        id: 'discount',
        Header: 'Discount',
        accessor: 'discountFormatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'discountFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('amount'),
        accessor: 'totalFormatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'totalFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
    ],
    [entries],
  );
};

/**
 * Invoice details more actions menu.
 * @returns {React.JSX}
 */
export const BadDebtMenuItem = ({ payload }: BadDebtMenuItemProps) => {
  const { invoice } = useInvoiceDetailDrawerContext();

  if (!invoice) {
    return null;
  }

  const { onCancelBadDebt, onBadDebt, onNotifyViaSMS, onConvert, onDeliver } =
    payload;

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
          <If condition={!invoice.isDelivered}>
            <MenuItem
              onClick={onDeliver}
              text={<T id={'mark_as_delivered'} />}
            />
          </If>
          <Choose>
            <Choose.When condition={!invoice.isWrittenoff}>
              <MenuItem
                text={<T id={'bad_debt.dialog.bad_debt'} />}
                onClick={onBadDebt}
              />
            </Choose.When>
            <Choose.When condition={!!invoice.isWrittenoff}>
              <MenuItem
                onClick={onCancelBadDebt}
                text={<T id={'bad_debt.dialog.cancel_bad_debt'} />}
              />
            </Choose.When>
          </Choose>
          <Can I={SaleInvoiceAction.Edit} a={AbilitySubject.Invoice}>
            <MenuItem
              onClick={onConvert}
              text={<T id={'invoice.convert_to_credit_note'} />}
            />
          </Can>
          <Can I={SaleInvoiceAction.NotifyBySms} a={AbilitySubject.Invoice}>
            <MenuItem
              onClick={onNotifyViaSMS}
              text={<T id={'notify_via_sms.dialog.notify_via_sms'} />}
            />
          </Can>
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
};

/**
 * Invoice details status.
 * @returns {React.JSX}
 */
export function InvoiceDetailsStatus({ invoice }: InvoiceDetailsStatusProps) {
  return (
    <Choose>
      <Choose.When condition={!!invoice.isFullyPaid && !!invoice.isDelivered}>
        <StatusTag intent={Intent.SUCCESS} round={true}>
          <T id={'paid'} />
        </StatusTag>
      </Choose.When>

      <Choose.When condition={!!invoice.isDelivered}>
        <Choose>
          <Choose.When condition={!!invoice.isOverdue}>
            <StatusTag intent={Intent.WARNING} round={true}>
              <T id={'overdue'} />
            </StatusTag>
          </Choose.When>
          <Choose.Otherwise>
            <StatusTag intent={Intent.PRIMARY} round={true}>
              <T id={'delivered'} />
            </StatusTag>
          </Choose.Otherwise>
        </Choose>
      </Choose.When>
      <Choose.Otherwise>
        <StatusTag round={true} minimal={true}>
          <T id={'draft'} />
        </StatusTag>
      </Choose.Otherwise>
    </Choose>
  );
}

const StatusTag = styled(Tag)`
  min-width: 65px;
  text-align: center;
`;
