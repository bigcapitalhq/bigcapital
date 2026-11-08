import { Intent, Menu, MenuDivider, MenuItem, Tag } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { CustomField } from '@bigcapital/sdk-ts';
import { Icon, If } from '@/components';
import { getCustomFieldDataTypeLabel } from '@/constants/customFields';
import { safeCallback } from '@/utils';

export interface CustomFieldsActionsPayload {
  onEdit?: (field: CustomField) => void;
  onToggleActive?: (field: CustomField) => void;
  onDelete?: (field: CustomField) => void;
}

interface ActionsMenuProps {
  payload: CustomFieldsActionsPayload;
  row: { original: CustomField };
}

export function ActionsMenu({
  payload: { onEdit, onToggleActive, onDelete },
  row: { original },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('custom_fields.action.edit')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon={original.active ? 'archive' : 'reset'} />}
        text={intl.get(
          original.active
            ? 'custom_fields.action.deactivate'
            : 'custom_fields.action.activate',
        )}
        onClick={safeCallback(onToggleActive, original)}
      />
      <If condition={!original.active}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={intl.get('custom_fields.action.delete')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
        />
      </If>
    </Menu>
  );
}

function StatusCell({ value }: { value: boolean }) {
  return (
    <Tag
      minimal={true}
      round={true}
      intent={value ? Intent.SUCCESS : Intent.NONE}
    >
      {intl.get(
        value ? 'custom_fields.status.active' : 'custom_fields.status.inactive',
      )}
    </Tag>
  );
}

function TypeCell({ value }: { value: string }) {
  return <span>{getCustomFieldDataTypeLabel(value, intl)}</span>;
}

function RequiredCell({ value }: { value: boolean }) {
  return <span>{value ? intl.get('yes') : intl.get('no')}</span>;
}

function ValuesCountCell({ value }: { value?: number }) {
  return <span>{value ?? 0}</span>;
}

export function useCustomFieldsTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'label',
        Header: intl.get('custom_fields.column.label'),
        accessor: 'label',
        width: 160,
      },
      {
        id: 'fieldName',
        Header: intl.get('custom_fields.column.api_name'),
        accessor: 'fieldName',
        width: 150,
        className: 'text-muted',
      },
      {
        id: 'dataType',
        Header: intl.get('custom_fields.column.type'),
        accessor: 'dataType',
        Cell: TypeCell,
        width: 160,
      },
      {
        id: 'required',
        Header: intl.get('custom_fields.column.required'),
        accessor: 'required',
        Cell: RequiredCell,
        width: 100,
      },
      {
        id: 'active',
        Header: intl.get('custom_fields.column.active'),
        accessor: 'active',
        Cell: StatusCell,
        width: 100,
      },
      {
        id: 'valuesCount',
        Header: intl.get('custom_fields.column.values_count'),
        accessor: 'valuesCount',
        Cell: ValuesCountCell,
        width: 90,
      },
      {
        id: 'sortOrder',
        Header: intl.get('custom_fields.column.order'),
        accessor: 'sortOrder',
        width: 70,
      },
    ],
    [],
  );
}
