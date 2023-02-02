// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
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

import { isNumber } from 'lodash';
import { Icon, Money, If, FormattedMessage as T, Can } from '@/components';
import { isBlank, safeCallback } from '@/utils';
import {
  InventoryAdjustmentAction,
  AbilitySubject,
} from '@/constants/abilityOption';

/**
 * Publish accessor
 */
export const PublishAccessor = (r) => {
  return r.is_published ? (
    <Tag minimal={true} round={true}>
      <T id={'published'} />
    </Tag>
  ) : (
    <Tag minimal={true} intent={Intent.WARNING} round={true}>
      <T id={'draft'} />
    </Tag>
  );
};

/**
 * Type column accessor.
 */
export const TypeAccessor = (row) => {
  return row.formatted_type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {row.formatted_type}
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
      {intl.get(row.type)}
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
      {intl.get(row.type)}
    </Tag>
  ) : null;
};

export const ActionsMenu = ({
  row: { original },
  payload: { onDelete, onPublish, onViewDetails },
}) => {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />

      <Can
        I={InventoryAdjustmentAction.Create}
        a={AbilitySubject.InventoryAdjustment}
      >
        <MenuDivider />
        <If condition={!original.is_published}>
          <MenuItem
            icon={<Icon icon={'arrow-to-top'} size={16} />}
            text={intl.get('publish_adjustment')}
            onClick={safeCallback(onPublish, original)}
          />
        </If>
      </Can>
      <Can
        I={InventoryAdjustmentAction.Delete}
        a={AbilitySubject.InventoryAdjustment}
      >
        <MenuItem
          text={intl.get('delete_adjustment')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
};

export const ActionsCell = (props) => {
  return (
    <Popover
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
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: (r) => moment(r.date).format('YYYY MMM DD'),
        width: 115,
        className: 'date',
        clickable: true,
      },
      {
        id: 'type',
        Header: intl.get('type'),
        accessor: TypeAccessor,
        className: 'type',
        width: 100,
        clickable: true,
      },
      {
        id: 'reason',
        Header: intl.get('reason'),
        accessor: 'reason',
        className: 'reason',
        width: 115,
        clickable: true,
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        className: 'reference_no',
        width: 100,
        clickable: true,
      },
      {
        id: 'published_at',
        Header: intl.get('status'),
        accessor: PublishAccessor,
        width: 95,
        className: 'publish',
        clickable: true,
      },
      {
        id: 'created_at',
        Header: intl.get('created_at'),
        accessor: (r) => moment(r.created_at).format('YYYY MMM DD'),
        width: 125,
        className: 'created_at',
        clickable: true,
      },
    ],
    [],
  );
};
