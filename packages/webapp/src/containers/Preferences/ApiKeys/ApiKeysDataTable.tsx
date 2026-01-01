// @ts-nocheck
import React, { useCallback } from 'react';
import { compose } from '@/utils';
import { DataTable, TableSkeletonRows, AppToaster } from '@/components';
import { useApiKeys, useRevokeApiKey } from '@/hooks/query';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { ActionsMenu, useApiKeysTableColumns } from './components';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';

/**
 * API Keys datatable.
 */
function ApiKeysDataTable({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,
}) {
  const { data: apiKeys, isLoading, isFetching } = useApiKeys();
  const { mutateAsync: revokeApiKey } = useRevokeApiKey();

  // API Keys list columns.
  const columns = useApiKeysTableColumns();

  // Handle revoke API key action.
  const handleRevokeApiKey = useCallback(
    (apiKey) => {
      revokeApiKey(apiKey.id)
        .then(() => {
          AppToaster.show({
            message: intl.get('api_key.revoke_success'),
            intent: Intent.SUCCESS,
          });
        })
        .catch((error) => {
          AppToaster.show({
            message: error?.response?.data?.message || intl.get('something_went_wrong'),
            intent: Intent.DANGER,
          });
        });
    },
    [revokeApiKey],
  );

  return (
    <DataTable
      columns={columns}
      data={apiKeys || []}
      loading={isLoading}
      headerLoading={isLoading}
      progressBarLoading={isFetching}
      TableLoadingRenderer={TableSkeletonRows}
      noInitialFetch={true}
      ContextMenu={ActionsMenu}
      payload={{
        onRevoke: handleRevokeApiKey,
      }}
    />
  );
}

export default compose(withDialogActions, withAlertActions)(ApiKeysDataTable);
