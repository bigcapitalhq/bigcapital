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
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import type { InventoryAdjustment } from '@bigcapital/sdk-ts';
import { Icon, Money, If, FormattedMessage as T, Can } from '@/components';
import {
  InventoryAdjustmentAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { isBlank, safeCallback } from '@/utils';

interface ActionsMenuPayload {
  onDelete: (row: InventoryAdjustment) => void;
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
  payload: { onDelete, onPublish, onViewDetails },
}: ActionsMenuProps) => {
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
        <If condition={!original.isPublished}>
          <MenuItem
            icon={
              // Icon wants `iconSize`, not `size`; preserved from @ts-nocheck.
              // @ts-expect-error see comment above
              <Icon icon={'arrow-to-top'} size={16} />
            }
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
        accessor: 'referenceNo',
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
        accessor: (r) => moment(r.createdAt).format('YYYY MMM DD'),
        width: 125,
        className: 'created_at',
        clickable: true,
      },
    ],
    [],
  );
};
