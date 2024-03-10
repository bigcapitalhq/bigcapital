// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
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
import { getColumnWidth } from '@/utils';
import {
  FormatNumberCell,
  Icon,
  FormattedMessage as T,
  Choose,
  Can,
  If,
  TextOverviewTooltipCell,
} from '@/components';
import { SaleInvoiceAction, AbilitySubject } from '@/constants/abilityOption';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Retrieve invoice readonly details table columns.
 */
export const useInvoiceReadonlyEntriesColumns = () => {
  // Invoice details drawer context.
  const {
    invoice: { entries },
  } = useInvoiceDetailDrawerContext();

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
        accessor: 'quantity',
        Cell: FormatNumberCell,
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'quantity', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate_formatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'rate_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('amount'),
        accessor: 'total_formatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'total_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
    ],
    [],
  );
};

/**
 * Invoice details more actions menu.
 * @returns {React.JSX}
 */
export const BadDebtMenuItem = ({
  payload: { onCancelBadDebt, onBadDebt, onNotifyViaSMS, onConvert, onDeliver },
}) => {
  const { invoice } = useInvoiceDetailDrawerContext();

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
          <If condition={!invoice.is_delivered}>
            <MenuItem
              onClick={onDeliver}
              text={<T id={'mark_as_delivered'} />}
            />
          </If>
          <Choose>
            <Choose.When condition={!invoice.is_writtenoff}>
              <MenuItem
                text={<T id={'bad_debt.dialog.bad_debt'} />}
                onClick={onBadDebt}
              />
            </Choose.When>
            <Choose.When condition={invoice.is_writtenoff}>
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
export function InvoiceDetailsStatus({ invoice }) {
  return (
    <Choose>
      <Choose.When condition={invoice.is_fully_paid && invoice.is_delivered}>
        <StatusTag intent={Intent.SUCCESS} round={true}>
          <T id={'paid'} />
        </StatusTag>
      </Choose.When>

      <Choose.When condition={invoice.is_delivered}>
        <Choose>
          <Choose.When condition={invoice.is_overdue}>
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
