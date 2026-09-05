import { Intent } from '@blueprintjs/core';
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { ActionsMenu, useApiKeysTableColumns } from './components';
import type { ApiKey } from './components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DataTable, TableSkeletonRows, AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useApiKeys, useRevokeApiKey } from '@/hooks/query';
import { compose } from '@/utils';

type ApiKeysDataTableInnerProps = Pick<WithDialogActionsProps, 'openDialog'> &
  Pick<WithAlertActionsProps, 'openAlert'>;

interface RevokeApiKeyError {
  response?: { data?: { message?: string } };
}

/**
 * API Keys datatable.
 */
function ApiKeysDataTableInner({
  // #withDialogActions
  openDialog: _openDialog,

  // #withAlertActions
  openAlert: _openAlert,
}: ApiKeysDataTableInnerProps) {
  const { data: apiKeys, isLoading, isFetching } = useApiKeys();
  const { mutateAsync: revokeApiKey } = useRevokeApiKey();

  // API Keys list columns.
  const columns = useApiKeysTableColumns();

  // Handle revoke API key action.
  const handleRevokeApiKey = useCallback(
    (apiKey: ApiKey) => {
      revokeApiKey(apiKey.id)
        .then(() => {
          AppToaster.show({
            message: intl.get('api_key.revoke_success'),
            intent: Intent.SUCCESS,
          });
        })
        .catch((error: RevokeApiKeyError) => {
          AppToaster.show({
            message:
              error?.response?.data?.message ||
              intl.get('something_went_wrong'),
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

export const ApiKeysDataTable = compose(
  withDialogActions,
  withAlertActions,
)(ApiKeysDataTableInner);
