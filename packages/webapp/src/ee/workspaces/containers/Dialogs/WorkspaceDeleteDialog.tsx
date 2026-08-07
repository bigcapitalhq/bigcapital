// @ts-nocheck
import {
  Button,
  Classes,
  Dialog,
  Intent,
  Callout,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, AppToaster } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useDeleteWorkspace } from '@/ee/workspaces/hooks/query';
import { compose } from '@/utils';

function WorkspaceDeleteDialog({
  dialogName,
  isOpen,
  payload: { organizationId, workspaceName } = {},

  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: deleteWorkspace, isLoading } = useDeleteWorkspace();
  const [confirmText, setConfirmText] = useState('');
  const confirmationPhrase = `Delete ${workspaceName || organizationId}`;
  const canDelete = confirmText === confirmationPhrase;

  const handleCancel = () => {
    setConfirmText('');
    closeDialog(dialogName);
  };

  const handleConfirmDelete = () => {
    deleteWorkspace(organizationId)
      .then(() => {
        AppToaster.show({
          message: intl.get('workspaces.workspace_deleted_successfully', {
            fallback: 'Workspace has been deleted successfully',
          }),
          intent: Intent.SUCCESS,
        });
        setConfirmText('');
        closeDialog(dialogName);
      })
      .catch((error) => {
        const errorType = error?.response?.data?.errors?.[0]?.type;
        const errorMessage =
          errorType === 'CANNOT_DELETE_CURRENT_ORGANIZATION'
            ? intl.get('workspaces.cannot_delete_current_organization', {
                fallback: 'Cannot delete the current organization',
              })
            : error?.response?.data?.errors?.[0]?.message ||
              intl.get('workspaces.cannot_delete_workspace', {
                fallback: 'Cannot delete workspace',
              });
        AppToaster.show({
          message: errorMessage,
          intent: Intent.DANGER,
        });
        setConfirmText('');
        closeDialog(dialogName);
      });
  };

  return (
    <Dialog
      title={intl.get('workspaces.delete_workspace', {
        fallback: 'Delete Workspace',
      })}
      isOpen={isOpen}
      onClose={handleCancel}
      canEscapeKeyClose={!isLoading}
      canOutsideClickClose={!isLoading}
      className="workspace-delete-dialog"
    >
      <div className={Classes.DIALOG_BODY}>
        <Callout intent={Intent.DANGER} icon="warning-sign">
          <span
            dangerouslySetInnerHTML={{
              __html: intl.get('workspaces.delete_workspace_confirmation', {
                name: workspaceName || organizationId,
                fallback: `Are you sure you want to delete <b>${workspaceName || organizationId}</b>? This action cannot be undone and all data will be permanently lost.`,
              }),
            }}
          />
        </Callout>

        <x.div pt={4}>
          <p>
            {intl.get('workspaces.delete_workspace_details', {
              fallback: 'Deleting this workspace will permanently remove:',
            })}
          </p>

          <x.ul pl={8} mb={4}>
            <x.li mb={1}>
              {intl.get('workspaces.delete_workspace_all_data', {
                fallback:
                  'All organization data including transactions, accounts, and contacts',
              })}
            </x.li>
            <x.li mb={1}>
              {intl.get('workspaces.delete_workspace_all_users', {
                fallback: 'All user associations and permissions',
              })}
            </x.li>
            <x.li mb={1}>
              {intl.get('workspaces.delete_workspace_database', {
                fallback: 'The entire database for this workspace',
              })}
            </x.li>
          </x.ul>

          <Callout intent={Intent.DANGER} icon="">
            {intl.get('workspaces.delete_workspace_irreversible', {
              fallback:
                'This action is irreversible. Please make sure you have exported any important data before proceeding.',
            })}
          </Callout>

          <FormGroup
            label={intl.get(
              'workspaces.delete_workspace_confirmation_input_label',
              {
                name: workspaceName || organizationId,
                fallback: `Type "Delete ${workspaceName || organizationId}" to confirm`,
              },
            )}
            className={css`
              margin-top: 20px;
              margin-bottom: 0;
            `}
          >
            <InputGroup
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={intl.get(
                'workspaces.delete_workspace_confirmation_input_placeholder',
                {
                  name: workspaceName || organizationId,
                  fallback: `Delete ${workspaceName || organizationId}`,
                },
              )}
              disabled={isLoading}
              fill
            />
          </FormGroup>
        </x.div>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCancel} disabled={isLoading}>
            <T id={'cancel'} />
          </Button>

          <Button
            intent={Intent.DANGER}
            onClick={handleConfirmDelete}
            loading={isLoading}
            disabled={!canDelete}
          >
            {intl.get('workspaces.confirm_delete_workspace', {
              fallback: 'Confirm Delete Workspace',
            })}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default compose(
  withDialogRedux(),
  withDialogActions,
)(WorkspaceDeleteDialog);
