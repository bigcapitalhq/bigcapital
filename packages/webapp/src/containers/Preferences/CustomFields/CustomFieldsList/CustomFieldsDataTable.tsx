// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent, Button, Position } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import { DataTable, AppToaster, TableSkeletonRows } from '@/components';

import { useCustomFieldsTableColumns, ActionsMenu } from './components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { useCustomFieldsContext } from './CustomFieldsListProvider';

import { compose } from '@/utils';

/**
 * Custom fields data table.
 */
function CustomFieldsDataTable({
  // #withAlertActions
  openAlert,
}) {
  // History context.
  const history = useHistory();

  // Retrieve custom fields table columns
  const columns = useCustomFieldsTableColumns();

  // Custom fields table context.
  const { customFields, isCustomFieldsFetching, isCustomFieldsLoading } =
    useCustomFieldsContext();

  // Handles delete the given custom field.
  const handleDeleteCustomField = ({ id }) => {
    openAlert('custom-field-delete', { customFieldId: id });
  };

  // Handles the edit of the given custom field.
  const handleEditCustomField = ({ id }) => {
    history.push(`/preferences/custom-fields/${id}`);
  };

  // Handles navigate to the new custom field page.
  const handleNewCustomField = () => {
    history.push('/preferences/custom-fields/new');
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          intent={Intent.PRIMARY}
          onClick={handleNewCustomField}
          text={intl.get('custom_fields.new_custom_field')}
        />
      </div>
      <CustomFieldsTable
        columns={columns}
        data={customFields}
        loading={isCustomFieldsLoading}
        headerLoading={isCustomFieldsFetching}
        progressBarLoading={isCustomFieldsFetching}
        TableLoadingRenderer={TableSkeletonRows}
        ContextMenu={ActionsMenu}
        payload={{
          onDeleteCustomField: handleDeleteCustomField,
          onEditCustomField: handleEditCustomField,
        }}
      />
    </div>
  );
}

const CustomFieldsTable = styled(DataTable)`
  .table .tr {
    min-height: 42px;
  }
`;

export default compose(withAlertActions)(CustomFieldsDataTable);
