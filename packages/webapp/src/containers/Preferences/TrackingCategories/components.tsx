import { Intent, Menu, MenuDivider, MenuItem, Tag } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { TrackingCategoriesList } from '@bigcapital/sdk-ts';
import { Icon, If } from '@/components';
import { safeCallback } from '@/utils';

export type TrackingCategory = TrackingCategoriesList[number];
export type TrackingCategoryOption = TrackingCategory['options'][number];

export interface TrackingCategoriesActionsPayload {
  onEdit?: (category: TrackingCategory) => void;
  onToggleActive?: (category: TrackingCategory) => void;
  onDelete?: (category: TrackingCategory) => void;
}

interface ActionsMenuProps {
  payload: TrackingCategoriesActionsPayload;
  row: { original: TrackingCategory };
}

/**
 * Context menu of tracking categories.
 */
export function ActionsMenu({
  payload: { onEdit, onToggleActive, onDelete },
  row: { original },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('tracking_categories.action.edit')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon={original.active ? 'archive' : 'reset'} />}
        text={intl.get(
          original.active
            ? 'tracking_categories.action.archive'
            : 'tracking_categories.action.restore',
        )}
        onClick={safeCallback(onToggleActive, original)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('tracking_categories.action.delete')}
        onClick={safeCallback(onDelete, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

interface NameCellProps {
  value: string;
}

function NameCell({ value }: NameCellProps) {
  return <span>{value}</span>;
}

interface OptionsCellProps {
  value: TrackingCategoryOption[];
}

/**
 * Options cell.
 */
function OptionsCell({ value }: OptionsCellProps) {
  const options = value ?? [];

  if (options.length === 0) {
    return <span className={'text-muted'}>—</span>;
  }

  return (
    <div className={'tracking-categories-options-cell'}>
      {options.map((option) => (
        <Tag
          key={option.id}
          minimal={true}
          className={!option.active ? 'is-archived' : undefined}
        >
          {option.name}
          <If condition={!option.active}>
            <span className={'tracking-categories-option-archived-label'}>
              {' '}
              ({intl.get('tracking_categories.status.archived')})
            </span>
          </If>
        </Tag>
      ))}
    </div>
  );
}

interface StatusCellProps {
  value: boolean;
}

function StatusCell({ value }: StatusCellProps) {
  return (
    <Tag
      minimal={true}
      intent={value ? Intent.SUCCESS : Intent.NONE}
      round={true}
    >
      {intl.get(
        value
          ? 'tracking_categories.status.active'
          : 'tracking_categories.status.archived',
      )}
    </Tag>
  );
}

/**
 * Retrieves tracking categories table columns.
 */
export function useTrackingCategoriesTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: intl.get('tracking_categories.column.name'),
        accessor: 'name',
        Cell: NameCell,
        width: 180,
        disableSortBy: true,
        textOverview: true,
      },
      {
        id: 'description',
        Header: intl.get('tracking_categories.column.description'),
        accessor: 'description',
        width: 220,
        disableSortBy: true,
        textOverview: true,
      },
      {
        id: 'options',
        Header: intl.get('tracking_categories.column.options'),
        accessor: 'options',
        Cell: OptionsCell,
        width: 260,
        disableSortBy: true,
      },
      {
        id: 'active',
        Header: intl.get('tracking_categories.column.status'),
        accessor: 'active',
        Cell: StatusCell,
        width: 100,
        disableSortBy: true,
      },
    ],
    [],
  );
}
