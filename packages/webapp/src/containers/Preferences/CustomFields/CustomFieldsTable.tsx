import React from 'react';
import { ActionsMenu, useCustomFieldsTableColumns } from './components';
import type { CustomField } from '@bigcapital/sdk-ts';
import { DataTable, TableSkeletonRows } from '@/components';

interface CustomFieldsTableProps {
  customFields: CustomField[];
  isLoading: boolean;
  isFetching: boolean;
  onEdit: (field: CustomField) => void;
  onToggleActive: (field: CustomField) => void;
  onDelete: (field: CustomField) => void;
}

export function CustomFieldsTable({
  customFields,
  isLoading,
  isFetching,
  onEdit,
  onToggleActive,
  onDelete,
}: CustomFieldsTableProps) {
  const columns = useCustomFieldsTableColumns();

  return (
    <DataTable
      columns={columns}
      data={customFields}
      loading={isLoading}
      headerLoading={isLoading}
      progressBarLoading={isFetching}
      rowTestId={'custom-field-row'}
      noInitialFetch={true}
      TableLoadingRenderer={TableSkeletonRows}
      ContextMenu={ActionsMenu}
      payload={{
        onEdit,
        onToggleActive,
        onDelete,
      }}
    />
  );
}
