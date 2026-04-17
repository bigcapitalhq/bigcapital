// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { safeCallback } from '@/utils';
import { Icon } from '@/components';

/**
 * Context menu of custom fields.
 */
export function ActionsMenu({
  payload: { onDeleteCustomField, onEditCustomField },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('custom_fields.edit')}
        onClick={safeCallback(onEditCustomField, original)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('custom_fields.delete')}
        onClick={safeCallback(onDeleteCustomField, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

/**
 * Retrieve Custom Fields table columns.
 * @returns
 */
export function useCustomFieldsTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'label',
        Header: intl.get('custom_fields.column.label'),
        accessor: 'label',
        className: 'label',
        width: '120',
        textOverview: true,
      },
      {
        id: 'fieldName',
        Header: intl.get('custom_fields.column.field_name'),
        accessor: 'fieldName',
        className: 'field-name',
        width: '120',
        textOverview: true,
      },
      {
        id: 'resourceName',
        Header: intl.get('custom_fields.column.resource'),
        accessor: 'resourceName',
        className: 'resource-name',
        width: '100',
        textOverview: true,
      },
      {
        id: 'fieldType',
        Header: intl.get('custom_fields.column.type'),
        accessor: 'fieldType',
        className: 'field-type',
        width: '80',
        textOverview: true,
      },
      {
        id: 'required',
        Header: intl.get('custom_fields.column.required'),
        accessor: 'required',
        className: 'required',
        width: '60',
        Cell: ({ value }) => (value ? intl.get('yes') : intl.get('no')),
      },
      {
        id: 'active',
        Header: intl.get('custom_fields.column.active'),
        accessor: 'active',
        className: 'active',
        width: '60',
        Cell: ({ value }) => (value ? intl.get('yes') : intl.get('no')),
      },
      {
        id: 'order',
        Header: intl.get('custom_fields.column.order'),
        accessor: 'order',
        className: 'order',
        width: '50',
      },
    ],
    [],
  );
}
