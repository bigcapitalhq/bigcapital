import React from 'react';
import {
  Menu,
  MenuDivider,
  MenuItem,
  Intent,
  Tag,
  Position,
  Button,
  Popover,
} from '@blueprintjs/core';
import { useIntl, FormattedMessage as T } from 'react-intl';
import moment from 'moment';
import { formatMessage } from 'services/intl';
import { isNumber } from 'lodash';
import { Icon, Money, If } from 'components';
import { isBlank, safeCallback } from 'utils';

/**
 * Publish accessor
 */
export const PublishAccessor = (r) => {
  return r.is_published ? (
    <Tag minimal={true}>
      <T id={'published'} />
    </Tag>
  ) : (
    <Tag minimal={true} intent={Intent.WARNING}>
      <T id={'draft'} />
    </Tag>
  );
};

/**
 * Type column accessor.
 */
export const TypeAccessor = (row) => {
  return row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {formatMessage({ id: row.type })}
    </Tag>
  ) : (
    ''
  );
};

/**
 * Item type accessor.
 */
export const ItemCodeAccessor = (row) =>
  row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {formatMessage({ id: row.type })}
    </Tag>
  ) : (
    ''
  );

/**
 * Quantity on hand cell.
 */
export const QuantityOnHandCell = ({ cell: { value } }) => {
  return isNumber(value) ? (
    <span className={'quantity_on_hand'}>{value}</span>
  ) : null;
};

/**
 * Cost price cell.
 */
export const CostPriceCell = ({ cell: { value } }) => {
  return !isBlank(value) ? <Money amount={value} currency={'USD'} /> : null;
};

/**
 * Sell price cell.
 */
export const SellPriceCell = ({ cell: { value } }) => {
  return !isBlank(value) ? <Money amount={value} currency={'USD'} /> : null;
};

/**
 * Item type accessor.
 */
export const ItemTypeAccessor = (row) => {
  return row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {formatMessage({ id: row.type })}
    </Tag>
  ) : null;
};

export const ActionsMenu = ({
  row: { original },
  payload: { onDelete },
}) => {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={formatMessage({ id: 'view_details' })}
      />
      <MenuDivider />
      <MenuItem
        text={formatMessage({ id: 'delete_adjustment' })}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
};

export const ActionsCell = (props) => {
  return (<Popover
    content={<ActionsMenu {...props} />}
    position={Position.RIGHT_BOTTOM}
  >
    <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
  </Popover>
  );
};

/**
 * Retrieve inventory adjustments columns.
 */
export const useInventoryAdjustmentsColumns = () => {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: formatMessage({ id: 'date' }),
        accessor: (r) => moment(r.date).format('YYYY MMM DD'),
        width: 115,
        className: 'date',
      },
      {
        id: 'type',
        Header: formatMessage({ id: 'type' }),
        accessor: TypeAccessor,
        className: 'type',
        width: 100,
      },
      {
        id: 'reason',
        Header: formatMessage({ id: 'reason' }),
        accessor: 'reason',
        className: 'reason',
        width: 115,
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference_no',
        className: 'reference_no',
        width: 100,
      },
      {
        id: 'publish',
        Header: formatMessage({ id: 'status' }),
        accessor: PublishAccessor,
        width: 95,
        className: 'publish',
      },
      {
        id: 'description',
        Header: formatMessage({ id: 'description' }),
        accessor: 'description',
        disableSorting: true,
        width: 85,
        className: 'description',
      },
      {
        id: 'created_at',
        Header: formatMessage({ id: 'created_at' }),
        accessor: (r) => moment(r.created_at).format('YYYY MMM DD'),
        width: 125,
        className: 'created_at',
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
};
