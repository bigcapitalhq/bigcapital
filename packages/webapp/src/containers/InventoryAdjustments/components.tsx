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
import { createColumnHelper } from '@tanstack/react-table';
import { isNumber } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import type { InventoryAdjustment } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Icon, Money, If, FormattedMessage as T, Can } from '@/components';
import {
  InventoryAdjustmentAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { isBlank, safeCallback } from '@/utils';

interface ActionsMenuPayload {
  onDelete: (row: InventoryAdjustment) => void;
  onEdit: (row: InventoryAdjustment) => void;
  onPublish: (row: InventoryAdjustment) => void;
  onViewDetails: (row: InventoryAdjustment) => void;
}

interface ActionsMenuProps {
  row: { original: InventoryAdjustment };
  payload: ActionsMenuPayload;
}

interface CellProps {
  cell: { value: unknown };
}

/**
 * Publish accessor
 */
export const PublishAccessor = (r: InventoryAdjustment) => {
  return r.isPublished ? (
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
export const TypeAccessor = (row: InventoryAdjustment) => {
  return row.formattedType ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {row.formattedType}
    </Tag>
  ) : (
    ''
  );
};

/**
 * Item type accessor.
 */
export const ItemCodeAccessor = (row: InventoryAdjustment) =>
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
export const QuantityOnHandCell = ({ cell: { value } }: CellProps) => {
  return isNumber(value) ? (
    <span className={'quantity_on_hand'}>{value}</span>
  ) : null;
};

/**
 * Cost price cell.
 */
export const CostPriceCell = ({ cell: { value } }: CellProps) => {
  return !isBlank(value) ? <Money amount={value} currency={'USD'} /> : null;
};

/**
 * Sell price cell.
 */
export const SellPriceCell = ({ cell: { value } }: CellProps) => {
  return !isBlank(value) ? <Money amount={value} currency={'USD'} /> : null;
};

/**
 * Item type accessor.
 */
export const ItemTypeAccessor = (row: InventoryAdjustment) => {
  return row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {intl.get(row.type)}
    </Tag>
  ) : null;
};

export const ActionsMenu = ({
  row: { original },
  payload: { onDelete, onEdit, onPublish, onViewDetails },
}: ActionsMenuProps) => {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />

      <Can
        I={InventoryAdjustmentAction.Edit}
        a={AbilitySubject.InventoryAdjustment}
      >
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_adjustment')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>

      <Can
        I={InventoryAdjustmentAction.Create}
        a={AbilitySubject.InventoryAdjustment}
      >
        <MenuDivider />
        <If condition={!original.isPublished}>
          <MenuItem
            icon={<Icon icon={'arrow-to-top'} iconSize={16} />}
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

export const ActionsCell = (props: ActionsMenuProps) => {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
};

const column = createColumnHelper<BP_TableFeatures, InventoryAdjustment>();

export function useInventoryAdjustmentsColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('date', {
          id: 'date',
          header: intl.get('date'),
          size: 115,
          cell: ({ getValue }) => moment(getValue()).format('YYYY MMM DD'),
        }),
        column.accessor('formattedType', {
          id: 'type',
          header: intl.get('type'),
          size: 100,
          cell: ({ row }) => TypeAccessor(row.original),
        }),
        column.accessor('reason', {
          id: 'reason',
          header: intl.get('reason'),
          size: 115,
        }),
        column.accessor('referenceNo', {
          id: 'reference_no',
          header: intl.get('reference_no'),
          size: 100,
        }),
        column.accessor('isPublished', {
          id: 'published_at',
          header: intl.get('status'),
          size: 95,
          cell: ({ row }) => PublishAccessor(row.original),
        }),
        column.accessor('createdAt', {
          id: 'created_at',
          header: intl.get('created_at'),
          size: 125,
          cell: ({ getValue }) => moment(getValue()).format('YYYY MMM DD'),
        }),
      ]),
    [],
  );
}
