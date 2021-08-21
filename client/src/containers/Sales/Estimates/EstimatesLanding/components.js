import React from 'react';
import {
  Intent,
  Tag,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import { Money, Choose, Icon, If } from 'components';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import { safeCallback } from 'utils';
import moment from 'moment';

/**
 * Status accessor.
 */
export const statusAccessor = (row) => (
  <Choose>
    <Choose.When condition={row.is_delivered && row.is_approved}>
      <Tag minimal={true} intent={Intent.SUCCESS}>
        <T id={'approved'} />
      </Tag>
    </Choose.When>
    <Choose.When condition={row.is_delivered && row.is_rejected}>
      <Tag minimal={true} intent={Intent.DANGER}>
        <T id={'rejected'} />
      </Tag>
    </Choose.When>
    <Choose.When
      condition={row.is_delivered && !row.is_rejected && !row.is_approved}
    >
      <Tag minimal={true} intent={Intent.SUCCESS}>
        <T id={'delivered'} />
      </Tag>
    </Choose.When>
    <Choose.Otherwise>
      <Tag minimal={true}>
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
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_estimate')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon="convert_to" />}
        text={intl.get('convert_to_invoice')}
        onClick={safeCallback(onConvert, original)}
      />
      <If condition={!original.is_delivered}>
        <MenuItem
          icon={<Icon icon={'check'} iconSize={18} />}
          text={intl.get('mark_as_delivered')}
          onClick={safeCallback(onDeliver, original)}
        />
      </If>
      <Choose>
        <Choose.When condition={original.is_delivered && original.is_approved}>
          <MenuItem
            icon={<Icon icon={'close-black'} />}
            text={intl.get('mark_as_rejected')}
            onClick={safeCallback(onReject, original)}
          />
        </Choose.When>
        <Choose.When condition={original.is_delivered && original.is_rejected}>
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
      <MenuItem
        icon={<Icon icon={'receipt-24'} iconSize={16} />}
        text={intl.get('estimate_paper')}
        onClick={safeCallback(onDrawer, original)}
      />
      <MenuItem
        icon={<Icon icon={'print-16'} iconSize={16} />}
        text={intl.get('print')}
        onClick={safeCallback(onPrint, original)}
      />
      <MenuItem
        text={intl.get('delete_estimate')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

function DateCell({ value }) {
  return moment(value).format('YYYY MMM DD');
}

function AmountAccessor({ amount, currency_code }) {
  return <Money amount={amount} currency={currency_code} />;
}

function ActionsCell(props) {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

export function useEstiamtesTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'estimate_date',
        Header: intl.get('estimate_date'),
        accessor: 'estimate_date',
        Cell: DateCell,
        width: 140,
        className: 'estimate_date',
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
      },
      {
        id: 'expiration_date',
        Header: intl.get('expiration_date'),
        accessor: 'expiration_date',
        Cell: DateCell,
        width: 140,
        className: 'expiration_date',
      },
      {
        id: 'estimate_number',
        Header: intl.get('estimate_number'),
        accessor: (row) =>
          row.estimate_number ? `#${row.estimate_number}` : null,
        width: 140,
        className: 'estimate_number',
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: AmountAccessor,
        width: 140,
        className: 'amount',
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: (row) => statusAccessor(row),
        width: 140,
        className: 'status',
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference',
        width: 90,
        className: 'reference',
      },
    ],
    [],
  );
}
