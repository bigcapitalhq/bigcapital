// @ts-nocheck
import React from 'react';
import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { SaleEstimateAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import {
  FormatDateCell,
  FormattedMessage as T,
  Money,
  Choose,
  Icon,
  If,
  Can,
} from '@/components';
import { safeCallback } from '@/utils';

/**
 * Status accessor.
 */
export const statusAccessor = (row) => (
  <Choose>
    <Choose.When condition={row.is_approved}>
      <Tag minimal={true} intent={Intent.SUCCESS} round={true}>
        <T id={'approved'} />
      </Tag>
    </Choose.When>
    <Choose.When condition={row.is_rejected}>
      <Tag minimal={true} intent={Intent.DANGER} round={true}>
        <T id={'rejected'} />
      </Tag>
    </Choose.When>
    <Choose.When condition={row.is_expired}>
      <Tag minimal={true} intent={Intent.WARNING} round={true}>
        <T id={'estimate.status.expired'} />
      </Tag>
    </Choose.When>
    <Choose.When condition={row.is_delivered}>
      <Tag minimal={true} intent={Intent.SUCCESS} round={true}>
        <T id={'delivered'} />
      </Tag>
    </Choose.When>
    <Choose.Otherwise>
      <Tag minimal={true} round={true}>
        <T id={'draft'} />
      </Tag>
    </Choose.Otherwise>
  </Choose>
);

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: {
    onEdit,
    onDeliver,
    onReject,
    onApprove,
    onDelete,
    onDrawer,
    onConvert,
    onViewDetails,
    onPrint,
  },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_estimate')}
          onClick={safeCallback(onEdit, original)}
        />
        <If condition={!original.is_converted_to_invoice}>
          <MenuItem
            icon={<Icon icon="convert_to" />}
            text={intl.get('convert_to_invoice')}
            onClick={safeCallback(onConvert, original)}
          />
        </If>

        <If condition={!original.is_delivered}>
          <MenuItem
            icon={<Icon icon={'check'} iconSize={18} />}
            text={intl.get('mark_as_delivered')}
            onClick={safeCallback(onDeliver, original)}
          />
        </If>
        <Choose>
          <Choose.When
            condition={original.is_delivered && original.is_approved}
          >
            <MenuItem
              icon={<Icon icon={'close-black'} />}
              text={intl.get('mark_as_rejected')}
              onClick={safeCallback(onReject, original)}
            />
          </Choose.When>
          <Choose.When
            condition={original.is_delivered && original.is_rejected}
          >
            <MenuItem
              icon={<Icon icon={'check'} iconSize={18} />}
              text={intl.get('mark_as_approved')}
              onClick={safeCallback(onApprove, original)}
            />
          </Choose.When>
          <Choose.When condition={original.is_delivered}>
            <MenuItem
              icon={<Icon icon={'check'} iconSize={18} />}
              text={intl.get('mark_as_approved')}
              onClick={safeCallback(onApprove, original)}
            />
            <MenuItem
              icon={<Icon icon={'close-black'} />}
              text={intl.get('mark_as_rejected')}
              onClick={safeCallback(onReject, original)}
            />
          </Choose.When>
        </Choose>
      </Can>
      <Can I={SaleEstimateAction.View} a={AbilitySubject.Estimate}>
        <MenuItem
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={intl.get('print')}
          onClick={safeCallback(onPrint, original)}
        />
      </Can>
      <Can I={SaleEstimateAction.Delete} a={AbilitySubject.Estimate}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_estimate')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

function AmountAccessor({ amount, currency_code }) {
  return <Money amount={amount} currency={currency_code} />;
}

export function useEstimatesTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'estimate_date',
        Header: intl.get('estimate_date'),
        accessor: 'estimate_date',
        Cell: FormatDateCell,
        width: 140,
        className: 'estimate_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'expiration_date',
        Header: intl.get('expiration_date'),
        accessor: 'expiration_date',
        Cell: FormatDateCell,
        width: 140,
        className: 'expiration_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'estimate_number',
        Header: intl.get('estimate_number'),
        accessor: (row) =>
          row.estimate_number ? `${row.estimate_number}` : null,
        width: 140,
        className: 'estimate_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: AmountAccessor,
        width: 140,
        align: 'right',
        clickable: true,
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: (row) => statusAccessor(row),
        width: 140,
        className: 'status',
        clickable: true,
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference',
        width: 90,
        className: 'reference',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
