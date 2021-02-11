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
import { FormattedMessage as T, useIntl } from 'react-intl';
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
  payload: { onEdit, onDeliver, onReject, onApprove, onDelete },
}) {
  const { formatMessage } = useIntl();

  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={formatMessage({ id: 'view_details' })}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_estimate' })}
        onClick={safeCallback(onEdit, original)}
      />
      <If condition={!original.is_delivered}>
        <MenuItem
          text={formatMessage({ id: 'mark_as_delivered' })}
          onClick={safeCallback(onDeliver, original)}
        />
      </If>
      <Choose>
        <Choose.When condition={original.is_delivered && original.is_approved}>
          <MenuItem
            text={formatMessage({ id: 'mark_as_rejected' })}
            onClick={safeCallback(onReject, original)}
          />
        </Choose.When>
        <Choose.When condition={original.is_delivered && original.is_rejected}>
          <MenuItem
            text={formatMessage({ id: 'mark_as_approved' })}
            onClick={safeCallback(onApprove, original)}
          />
        </Choose.When>
        <Choose.When condition={original.is_delivered}>
          <MenuItem
            text={formatMessage({ id: 'mark_as_approved' })}
            onClick={safeCallback(onApprove, original)}
          />
          <MenuItem
            text={formatMessage({ id: 'mark_as_rejected' })}
            onClick={safeCallback(onReject, original)}
          />
        </Choose.When>
      </Choose>
      <MenuItem
        text={formatMessage({ id: 'delete_estimate' })}
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

function AmountAccessor(row) {
  return <Money amount={row.amount} currency={'USD'} />;
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
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'estimate_date',
        Header: formatMessage({ id: 'estimate_date' }),
        accessor: 'estimate_date',
        Cell: DateCell,
        width: 140,
        className: 'estimate_date',
      },
      {
        id: 'customer_id',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
      },
      {
        id: 'expiration_date',
        Header: formatMessage({ id: 'expiration_date' }),
        accessor: 'expiration_date',
        Cell: DateCell,
        width: 140,
        className: 'expiration_date',
      },
      {
        id: 'estimate_number',
        Header: formatMessage({ id: 'estimate_number' }),
        accessor: (row) =>
          row.estimate_number ? `#${row.estimate_number}` : null,
        width: 140,
        className: 'estimate_number',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: AmountAccessor,
        width: 140,
        className: 'amount',
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'status' }),
        accessor: (row) => statusAccessor(row),
        width: 140,
        className: 'status',
      },
      {
        id: 'reference',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference',
        width: 140,
        className: 'reference',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [formatMessage],
  );
}
